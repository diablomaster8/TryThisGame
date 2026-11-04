// WORLD-67: every stretch of the Grove's edge is an exit, a natural hedge or a "not yet"
// log; walking into it at 16 points ends at a blocker (or an exit), never on bare grass,
// and says why once.
import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { SIM } from '../../src/config/tuning';
import { BORDER } from '../../src/config/tuning-r9d2';
import { borderBlockers, borderEdge, BORDER_WAYS } from '../../src/sim/border';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

const H = SIM.worldHalf;
// Four a side: the corners' neighbours, open stretches and each way out.
const POINTS: Array<[number, number]> = [
  [-40, -H],
  [-28, -H],
  [0, -H],
  [30, -H],
  [H, -40],
  [H, -24],
  [H, 0],
  [H, 40],
  [-40, H],
  [12, H],
  [20, H],
  [40, H],
  [-H, -30],
  [-H, -6],
  [-H, 6],
  [-H, 30],
];

describe('the Grove border (WORLD-67)', () => {
  it('has a kind for every border point, with the ways out found', () => {
    expect(BORDER_WAYS.map((w) => w.id).sort()).toEqual(
      ['grove-marsh', 'grove-moon', 'grove-ridge', 'grove-sun', 'grove-wood'].sort(),
    );
    // R11 d7: the marsh is the shore's open border now; the Sun gate waits for its unlock.
    expect(borderEdge(12, H).kind).toBe('exit');
    expect(borderEdge(-H, -6).kind).toBe('notYet');
    expect(borderEdge(-H, 6).stretch).toBe('grove-moon');
    expect(borderEdge(0, -H)).toEqual({ kind: 'natural', side: 'n', stretch: 'n' });
  });

  it('ends a walk into each of 16 border points at a blocker, saying why once', () => {
    const blocks = borderBlockers();
    for (const [bx, bz] of POINTS) {
      const w = createWorld(3, 0);
      w.nubbins = [];
      const nx = Math.abs(bx) >= H ? Math.sign(bx) : 0;
      const nz = Math.abs(bz) >= H ? Math.sign(bz) : 0;
      w.keeper.pos = { x: bx - nx * 2.5, z: bz - nz * 2.5 };
      applyCommand(w, { kind: 'keeperInput', input: { x: nx, z: nz } }, []);
      const events: SimEvent[] = [];
      for (let i = 0; i < 40; i++) events.push(...stepWorld(w, SIM.stepMs));
      const p = w.keeper.pos;
      const at = `${bx},${bz} -> ${p.x.toFixed(2)},${p.z.toFixed(2)}`;
      // R11 d7: an open seamless border is walked straight over into the neighbour.
      if (w.location !== 'grove') {
        expect(borderEdge(bx, bz).kind, at).toBe('exit');
        expect(w.location, at).toMatch(/^region:/);
        continue;
      }
      // The walk reached the edge and stopped there.
      expect(Math.max(Math.abs(p.x), Math.abs(p.z)), at).toBeGreaterThan(H - 0.05);
      const edge = borderEdge(p.x, p.z, w);
      const near = blocks.filter((b) => Math.hypot(b.x - p.x, b.z - p.z) < BORDER.step + 0.5);
      if (edge.kind === 'natural')
        expect(
          near.some((b) => b.kind === 'hedge'),
          at,
        ).toBe(true);
      // R11 d7: a built land's shut gate is its own blocker (the gate is drawn, not a log).
      const shutGate = BORDER_WAYS.some((w) => w.id === edge.stretch && REGIONS[w.to].built);
      if (edge.kind === 'notYet' && !shutGate)
        expect(
          near.some((b) => b.kind === 'log'),
          at,
        ).toBe(true);
      const said = events.filter((e) => e.kind === 'borderPushed');
      expect(said.length, at).toBe(edge.kind === 'exit' ? 0 : 1);
    }
  });

  it('says why when a tap past the edge walks the Keeper up to it', () => {
    const w = createWorld(5, 0);
    w.nubbins = [];
    w.keeper.pos = { x: -H + 4, z: -6 };
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: -H - 6, z: -6 } }, []);
    const ev: SimEvent[] = [];
    for (let i = 0; i < 40; i++) ev.push(...stepWorld(w, SIM.stepMs));
    const said = ev.filter((e) => e.kind === 'borderPushed');
    expect(said).toEqual([{ kind: 'borderPushed', edge: 'notYet', stretch: 'grove-sun' }]);
  });

  it('speaks again only after the Keeper has gone well back in', () => {
    const w = createWorld(4, 0);
    w.nubbins = [];
    const push = () => {
      w.keeper.pos = { x: 0, z: H - 1 };
      applyCommand(w, { kind: 'keeperInput', input: { x: 0, z: 1 } }, []);
      const ev: SimEvent[] = [];
      for (let i = 0; i < 20; i++) ev.push(...stepWorld(w, SIM.stepMs));
      return ev.filter((e) => e.kind === 'borderPushed').length;
    };
    expect(push()).toBe(1);
    expect(push()).toBe(0);
    w.keeper.pos = { x: 0, z: H - BORDER.rearm - 2 };
    applyCommand(w, { kind: 'keeperInput', input: { x: 0, z: 0 } }, []);
    stepWorld(w, SIM.stepMs);
    expect(push()).toBe(1);
  });
});
