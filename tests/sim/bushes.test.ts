// MOVE-43: bushes are soft and fun. Walking into one rustles it (an event both renderers
// shake on), a bush gives up its hidden shell once per save at most, and a Shy Nubbin is
// found tucked in bushes far more often than a Cheerful one.
import { describe, expect, it } from 'vitest';
import { EGG, SIM } from '../../src/config/tuning';
import { obstacles, softAt } from '../../src/sim/obstacles';
import type { Personality, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function aBush(w: World) {
  const b = obstacles(w).find((c) => c.flags.includes('soft') && c.id.startsWith('wild-'));
  if (!b) throw new Error('no bush');
  return b;
}

/** Walk the Keeper through the bush from the west; returns the events. */
function walkThrough(w: World): SimEvent[] {
  const b = aBush(w);
  const out: SimEvent[] = [];
  w.keeper.pos = { x: b.x - 2.5, z: b.z };
  w.keeper.input = { x: 1, z: 0 };
  for (let i = 0; i < 40; i++) out.push(...stepWorld(w, SIM.stepMs));
  w.keeper.input = { x: 0, z: 0 };
  applyCommand(w, { kind: 'moveKeeperTo', pos: { x: b.x - 6, z: b.z } }, []);
  for (let i = 0; i < 80; i++) stepWorld(w, SIM.stepMs);
  return out;
}

describe('soft bushes (MOVE-43)', () => {
  it('rustles once each time the Keeper walks into one', () => {
    const w = createWorld(4, 0);
    w.nubbins = [];
    const ev = walkThrough(w).filter((e) => e.kind === 'bushRustle');
    expect(ev.length).toBe(1);
    expect(walkThrough(w).filter((e) => e.kind === 'bushRustle').length).toBe(1);
  });

  it('gives up its hidden shell once per save at most', () => {
    const w = createWorld(5, 0);
    w.nubbins = [];
    const b = aBush(w);
    let found = 0;
    for (let k = 0; k < 6; k++) {
      // Long enough away that the chance is certain each visit.
      w.timeMs += 60 * 3_600_000;
      for (const e of walkThrough(w)) if (e.kind === 'bushRustle' && e.found) found++;
    }
    expect(found).toBe(1);
    expect(w.bushFinds?.found).toEqual([b.id]);
  });

  it('a Shy Nubbin sits in bushes over 3x as often as a Cheerful one', () => {
    const inside = (p: Personality): number => {
      const w = createWorld(31, 0);
      for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 5; i++) stepWorld(w, SIM.stepMs);
      w.nubbins = [w.nubbins[0]!];
      const n = w.nubbins[0]!;
      n.stage = 'adult';
      n.personality = p;
      const b = aBush(w);
      n.pos = { x: b.x + 3, z: b.z + 3 };
      let steps = 0;
      for (let i = 0; i < (15 * 60_000) / SIM.stepMs; i++) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
        stepWorld(w, SIM.stepMs);
        if (softAt(n.pos, w, 0)) steps++;
      }
      return steps;
    };
    const shy = inside('shy');
    const cheerful = inside('cheerful');
    expect(shy).toBeGreaterThan(3 * Math.max(cheerful, 10));
  }, 20_000);
});
