/**
 * R0086 (WORLD-20): the sim's height field API (`sim/height.ts`) and the Nubbins' use of it
 * (`sim/nubbin-hill.ts`). The Keeper walks the 16,-16 hill's ramp to level 3 and back down
 * and cannot climb off the ramp; a Nubbin on an outing walks the same ramp to the top and
 * back, never rising more than a step (or a level, for a flutter) in one move.
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { JUMP } from '../../src/config/tuning-sim';
import { canStep, heightAt, hillRoute, levelRise, onRamp, terraceAt } from '../../src/sim/height';
import { keeperFooting } from '../../src/sim/keeper';
import { hillOutingStep, onHill } from '../../src/sim/nubbin-hill';
import { groveHeight, ledgeY, TERRACES } from '../../src/sim/terrain';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Vec2, World } from '../../src/sim/types';

const H1 = TERRACES.find((t) => t.x === 16 && t.z === -16)!;
const H1_INDEX = TERRACES.indexOf(H1);

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

/** Walk the Keeper through the points by taps, one after the other. */
function walk(w: World, pts: Vec2[]): number {
  let top = 0;
  for (const p of pts) {
    applyCommand(w, { kind: 'moveKeeperTo', pos: p }, []);
    for (let s = 0; s < 200 && w.keeper.moveTarget; s++) {
      stepWorld(w, SIM.stepMs);
      top = Math.max(top, terraceAt('grove', w.keeper.pos.x, w.keeper.pos.z));
    }
  }
  return top;
}

describe('the height field (WORLD-20)', () => {
  it('names the levels: 0 on the plain, the tier count on the top', () => {
    expect(H1.tiers.length).toBe(4);
    expect(terraceAt('grove', H1.x, H1.z)).toBe(4);
    expect(terraceAt('grove', 0, 4)).toBe(0);
    expect(terraceAt('hollow', H1.x, H1.z)).toBe(0);
    expect(heightAt('grove', H1.x, H1.z)).toBeCloseTo(groveHeight(H1.x, H1.z), 6);
    expect(heightAt('dungeon', H1.x, H1.z)).toBe(0);
    // Every route point after the foot is on the ramp or a shelf, and steps up at most a step.
    const r = hillRoute(H1);
    expect(r.slice(1, -1).some((p) => onRamp('grove', p.x, p.z))).toBe(true);
    for (let i = 1; i < r.length; i++) expect(canStep('grove', r[i - 1]!, r[i]!)).toBe(true);
  });

  it('walks the Keeper up the 16,-16 ramp to level 3 and back down', () => {
    const w = bare();
    const r = hillRoute(H1);
    standAt(w, r[0]!);
    const top = walk(w, r);
    expect(top).toBeGreaterThanOrEqual(3);
    expect(terraceAt('grove', w.keeper.pos.x, w.keeper.pos.z)).toBeGreaterThanOrEqual(3);
    walk(w, [...r].reverse());
    expect(terraceAt('grove', w.keeper.pos.x, w.keeper.pos.z)).toBe(0);
  });

  it('never lets the Keeper climb the 16,-16 hill off its ramp', () => {
    const w = bare();
    // Opposite the ramp's foot, pressed at the cliff for six seconds.
    const a = H1.ramp[0]!.a0 + Math.PI;
    standAt(w, { x: H1.x + Math.cos(a) * (H1.reach + 1), z: H1.z + Math.sin(a) * (H1.reach + 1) });
    w.keeper.input = { x: -Math.cos(a), z: -Math.sin(a) };
    let top = 0;
    for (let s = 0; s < 60; s++) {
      stepWorld(w, SIM.stepMs);
      top = Math.max(top, terraceAt('grove', w.keeper.pos.x, w.keeper.pos.z));
    }
    expect(top).toBe(0);
  });

  it('lets a flutter clear one level and no more', () => {
    const r = hillRoute(H1, true);
    // The flutter: from the plain beside the first cliff onto the first shelf.
    expect(canStep('grove', r[0]!, r[1]!)).toBe(false);
    expect(canStep('grove', r[0]!, r[1]!, true)).toBe(true);
    const top = { x: H1.x, z: H1.z };
    expect(canStep('grove', r[0]!, top, true)).toBe(false);
    expect(levelRise(H1.x, H1.z)).toBeCloseTo(H1.h / 4, 6);
  });
});

describe('Nubbins on the hills (WORLD-20)', () => {
  for (const flutter of [false, true]) {
    it(`walks a Nubbin up the 16,-16 hill and back${flutter ? ', fluttering the first cliff' : ''}`, () => {
      const w = createWorld(3, 0);
      const n = w.nubbins[0]!;
      n.stage = 'adult';
      if (flutter) n.stats.fly.points = 30 * 100;
      const r = hillRoute(H1, flutter);
      n.pos = { ...r[0]! };
      n.behavior.state = 'perform';
      n.behavior.target = null;
      n.behavior.itemId = `hill:${H1_INDEX}:${flutter ? 1 : 0}:go:0`;
      let now = 0;
      let top = 0;
      let rise = 0;
      let wasOn = false;
      let back = false;
      for (let s = 0; s < 3000; s++) {
        const from = { ...n.pos };
        if (!hillOutingStep(n, SIM.stepMs, now)) {
          back = true;
          break;
        }
        now += SIM.stepMs;
        n.behavior.untilMs = Math.min(n.behavior.untilMs, now + 1000);
        rise = Math.max(rise, ledgeY(n.pos.x, n.pos.z) - ledgeY(from.x, from.z));
        top = Math.max(top, terraceAt('grove', n.pos.x, n.pos.z));
        wasOn ||= onHill(n);
      }
      expect(back).toBe(true);
      expect(wasOn).toBe(true);
      expect(top).toBe(4);
      expect(rise).toBeLessThanOrEqual(JUMP.stepUp + (flutter ? levelRise(H1.x, H1.z) : 0));
      expect(terraceAt('grove', n.pos.x, n.pos.z)).toBe(0);
    });
  }

  it('keeps a Nubbin standing on a hill top there through the world step', () => {
    const w = createWorld(3, 0);
    const n = w.nubbins[0]!;
    n.stage = 'adult';
    n.pos = { x: H1.x + 0.5, z: H1.z };
    n.behavior.state = 'sit';
    n.behavior.untilMs = 1e9;
    for (let s = 0; s < 20; s++) stepWorld(w, SIM.stepMs);
    expect(terraceAt('grove', n.pos.x, n.pos.z)).toBe(4);
  });
});
