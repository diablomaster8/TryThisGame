/**
 * The hill terraces (R0011, MOVE-09): each hill is a stack of tiers with upright cliffs and
 * one ramp. A walking Keeper climbs only by the ramp; a jump clears one tier; Nubbins keep
 * off the hills; hill 1's waterfall face is never climbed.
 */
import { describe, expect, it } from 'vitest';
import { GROVE, SIM } from '../../src/config/tuning';
import { JUMP } from '../../src/config/tuning-sim';
import { markAt } from '../../src/config/stage-marks';
import { keeperFooting } from '../../src/sim/keeper';
import { blocked } from '../../src/sim/obstacles';
import { groveHeight, hillHeight, TERRACES } from '../../src/sim/terrain';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Vec2, World } from '../../src/sim/types';

function bare(): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  return w;
}

function standAt(w: World, p: Vec2): void {
  w.keeper.pos = { ...p };
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.vy = 0;
  w.keeper.grounded = true;
}

/** Whether an angle (radians) lies on a hill's first ramp leg, give or take `pad`. */
function onFirstLeg(t: (typeof TERRACES)[number], a: number, pad: number): boolean {
  const leg = t.ramp[0]!;
  const u = (((a - leg.a0 + pad) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return u <= leg.a1 - leg.a0 + 2 * pad;
}

describe('hill terraces (MOVE-09)', () => {
  it('builds every step under a jump, with the top at the hill height', () => {
    for (const t of TERRACES) {
      expect(t.tiers.length).toBeGreaterThanOrEqual(2);
      let below = 0;
      for (const tier of t.tiers) {
        expect(tier.top - below).toBeGreaterThanOrEqual(0.6 - 1e-9);
        expect(tier.top - below).toBeLessThanOrEqual(0.9 + 1e-9);
        below = tier.top;
      }
      expect(hillHeight(t.x, t.z, false)).toBeCloseTo(t.h, 9);
    }
  });

  it('never lets a walking Keeper climb a cliff face', () => {
    for (const t of TERRACES) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        // Off the ramp's foot: from there the only way up would be the face itself.
        if (onFirstLeg(t, a, 0.5)) continue;
        const w = bare();
        const from = { x: t.x + Math.cos(a) * (t.reach + 1), z: t.z + Math.sin(a) * (t.reach + 1) };
        const edge = SIM.worldHalf - 0.5;
        if (Math.abs(from.x) > edge || Math.abs(from.z) > edge) continue;
        if (blocked(from, w, 0.4) || groveHeight(from.x, from.z) < -0.3) continue;
        standAt(w, from);
        w.keeper.input = { x: -Math.cos(a), z: -Math.sin(a) };
        // Pressed at the face for six seconds, it never stands higher than a step: a slide
        // along the cliff may carry it onto the ramp's foot, never up onto a tier.
        let high = 0;
        for (let s = 0; s < 60; s++) {
          stepWorld(w, SIM.stepMs);
          high = Math.max(high, hillHeight(w.keeper.pos.x, w.keeper.pos.z, false));
        }
        expect(high, `hill at , from `).toBeLessThan(t.tiers[0]!.top - JUMP.stepUp);
      }
    }
  });

  it('walks the ramp to Briar on top of hill 0 with the feet on the ground', () => {
    const w = bare();
    const briar = markAt('grove', 'briar')!;
    const to = { x: briar.x + 0.6, z: briar.z };
    applyCommand(w, { kind: 'moveKeeperTo', pos: to }, []);
    for (let s = 0; s < 1200 && w.keeper.moveTarget; s++) stepWorld(w, SIM.stepMs);
    const k = w.keeper;
    expect(k.moveTarget).toBeNull();
    expect(Math.hypot(k.pos.x - to.x, k.pos.z - to.z)).toBeLessThan(0.6);
    expect(hillHeight(k.pos.x, k.pos.z, false)).toBeCloseTo(GROVE.hills[0]!.h, 6);
    expect(Math.abs(k.y - groveHeight(k.pos.x, k.pos.z))).toBeLessThan(0.05);
  });

  it('climbs every hill by its ramp from a tap', () => {
    for (const t of TERRACES) {
      const w = bare();
      const leg = t.ramp[0]!;
      const foot = {
        x: t.x + Math.cos(leg.a0 - 0.3) * (t.reach + 1.5),
        z: t.z + Math.sin(leg.a0 - 0.3) * (t.reach + 1.5),
      };
      standAt(w, foot);
      applyCommand(w, { kind: 'moveKeeperTo', pos: { x: t.x + 0.3, z: t.z + 0.2 } }, []);
      for (let s = 0; s < 1500 && w.keeper.moveTarget; s++) stepWorld(w, SIM.stepMs);
      expect(w.keeper.moveTarget, `${t.x},${t.z}`).toBeNull();
      expect(w.keeper.y - groveHeight(t.x, t.z), `${t.x},${t.z}`).toBeGreaterThan(-0.1);
    }
  });

  it('clears one tier with a jump', () => {
    const t = TERRACES[0]!;
    // South-west of hill 0, clear of every ramp leg; face the hill and jump while walking in.
    const a = (230 * Math.PI) / 180;
    expect(onFirstLeg(t, a, 0.3)).toBe(false);
    const w = bare();
    standAt(w, { x: t.x + Math.cos(a) * (t.r + 0.4), z: t.z + Math.sin(a) * (t.r + 0.4) });
    w.keeper.input = { x: -Math.cos(a), z: -Math.sin(a) };
    applyCommand(w, { kind: 'jump', down: true }, []);
    for (let s = 0; s < 4; s++) stepWorld(w, SIM.stepMs);
    w.keeper.input = { x: 0, z: 0 };
    for (let s = 0; s < 10; s++) stepWorld(w, SIM.stepMs);
    expect(hillHeight(w.keeper.pos.x, w.keeper.pos.z, false)).toBeCloseTo(t.tiers[0]!.top, 6);
    expect(w.keeper.grounded).toBe(true);
  });

  it('keeps Nubbins off the hills and the Keeper off the waterfall face', () => {
    const h0 = GROVE.hills[0]!;
    expect(blocked({ x: h0.x + 2, z: h0.z }, null, 0.3, 'nubbin')).toBe(true);
    expect(blocked({ x: h0.x + 2, z: h0.z }, null, 0.3, 'keeper')).toBe(false);
    const h1 = GROVE.hills[1]!;
    const f = GROVE.river.inflow[0]!;
    const len = Math.hypot(f.x - h1.x, f.z - h1.z);
    for (const s of [0.4, 0.6, 0.8]) {
      const p = {
        x: h1.x + ((f.x - h1.x) / len) * h1.r * s,
        z: h1.z + ((f.z - h1.z) / len) * h1.r * s,
      };
      expect(blocked(p, null, 0.3, 'keeper', h1.h + 5)).toBe(true);
    }
  });
});
