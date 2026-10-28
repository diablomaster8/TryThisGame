/**
 * Auto-hop (R0024, MOVE-24): with the setting on, a tap walk hops a log on its way and jumps
 * up a terrace; with it off, the walk goes round the log and up the hill by its ramp.
 */
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { GROVE_COLLIDERS } from '../../src/config/grove-layout';
import { keeperFooting } from '../../src/sim/keeper';
import { autoHopOn } from '../../src/sim/nav';
import { blocked } from '../../src/sim/obstacles';
import { hillHeight, TERRACES } from '../../src/sim/terrain';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent, Vec2, World } from '../../src/sim/types';

function bare(autoHop: boolean): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  w.settings.autoHop = autoHop;
  return w;
}

function standAt(w: World, p: Vec2): void {
  w.keeper.pos = { ...p };
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.vy = 0;
  w.keeper.grounded = true;
}

/** Tap `to` and step until the walk ends; the steps taken and the jumps made. */
function walk(w: World, to: Vec2, max = 1500): { steps: number; jumps: number } {
  applyCommand(w, { kind: 'moveKeeperTo', pos: to }, []);
  let jumps = 0;
  let steps = 0;
  for (; steps < max && (w.keeper.moveTarget || !w.keeper.grounded); steps++) {
    const ev: SimEvent[] = stepWorld(w, SIM.stepMs);

    jumps += ev.filter((e) => e.kind === 'keeperJumped').length;
  }
  return { steps, jumps };
}

/** A log with open ground 1.4 u either side of it along some line through its middle. */
function logCrossing(): { from: Vec2; to: Vec2 } {
  for (const c of GROVE_COLLIDERS) {
    if (c.shape.type !== 'segment' || !c.flags.includes('hop')) continue;
    for (let deg = 0; deg < 180; deg += 15) {
      const a = (deg * Math.PI) / 180;
      const from = { x: c.x + Math.cos(a) * 1.4, z: c.z + Math.sin(a) * 1.4 };
      const to = { x: c.x - Math.cos(a) * 1.4, z: c.z - Math.sin(a) * 1.4 };
      const pts = [from, to, { x: (from.x + c.x) / 2, z: (from.z + c.z) / 2 }];
      if (pts.some((p) => blocked(p, null, 0.4))) continue;
      // Square on: the log runs out 0.7 u to both sides of the crossing line.
      const side = (k: number): Vec2 => ({ x: c.x - Math.sin(a) * k, z: c.z + Math.cos(a) * k });
      if (!blocked(side(0.7), null, 0) || !blocked(side(-0.7), null, 0)) continue;
      if (Math.abs(hillHeight(from.x, from.z) - hillHeight(to.x, to.z)) > 0.05) continue;
      return { from, to };
    }
  }
  throw new Error('no log to cross');
}

describe('auto-hop (MOVE-24)', () => {
  it('follows the Learning Grove when unset', () => {
    const w = createWorld(1, 0);
    expect(autoHopOn(w)).toBe(false);
    w.settings.autoHop = true;
    expect(autoHopOn(w)).toBe(true);
  });

  it('hops a log on a tap walk, and walks round it with the setting off', () => {
    const { from, to } = logCrossing();

    const on = bare(true);
    standAt(on, from);
    const hop = walk(on, to);
    expect(on.keeper.moveTarget).toBeNull();
    expect(Math.hypot(on.keeper.pos.x - to.x, on.keeper.pos.z - to.z)).toBeLessThan(0.6);
    expect(hop.jumps).toBeGreaterThanOrEqual(1);

    const off = bare(false);
    standAt(off, from);
    const round = walk(off, to);
    expect(Math.hypot(off.keeper.pos.x - to.x, off.keeper.pos.z - to.z)).toBeLessThan(0.6);
    expect(round.jumps).toBe(0);
  });

  it('jumps up a terrace with the setting on, and takes the ramp with it off', () => {
    const t = TERRACES[0]!;
    const a = (230 * Math.PI) / 180;
    const foot = { x: t.x + Math.cos(a) * (t.r + 0.8), z: t.z + Math.sin(a) * (t.r + 0.8) };
    const top = { x: t.x + 0.3, z: t.z + 0.2 };
    const crest = hillHeight(top.x, top.z, false);

    const on = bare(true);
    standAt(on, foot);
    const up = walk(on, top);
    expect(on.keeper.moveTarget).toBeNull();
    expect(on.keeper.y).toBeGreaterThan(crest - 0.1);
    expect(up.jumps).toBeGreaterThanOrEqual(1);

    const off = bare(false);
    standAt(off, foot);
    const ramp = walk(off, top);
    expect(off.keeper.moveTarget).toBeNull();
    expect(off.keeper.y).toBeGreaterThan(crest - 0.1);
    expect(ramp.jumps).toBe(0);
    expect(up.steps).toBeLessThan(ramp.steps);
  });
});
