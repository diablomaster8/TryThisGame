import { describe, expect, it } from 'vitest';
import { noteCoopShake } from '../../src/sim/coop-gags';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// R0364 (FUN-75): each co-op gag fires in a scripted two-Keeper run.

function coop(): World {
  const w = createWorld(1, 0);
  applyCommand(w, { kind: 'setCoop', active: true, trainer: 'nova' }, []);
  return w;
}
const steps = (w: World, n: number, ev: SimEvent[] = []): SimEvent[] => {
  for (let i = 0; i < n; i++) ev.push(...stepWorld(w, 100));
  return ev;
};
const gags = (ev: SimEvent[], g: string) => ev.filter((e) => e.kind === 'coopGag' && e.gag === g);

describe('co-op comedy', () => {
  it('both Keepers petting one Nubbin makes the double-happy spin', () => {
    const w = coop();
    const n = w.nubbins.find((x) => x.stage !== 'egg') ?? w.nubbins[0]!;
    n.stage = 'child';
    n.behavior.state = 'sit';
    w.keeper.pos = { x: n.pos.x + 0.5, z: n.pos.z };
    w.keeper2!.pos = { x: n.pos.x - 0.5, z: n.pos.z };
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'pet', nubbinId: n.id }, ev);
    steps(w, 1, ev);
    applyCommand(w, { kind: 'keeper2Act', action: 'pet' }, ev);
    expect(gags(ev, 'spin').length).toBe(1);
  });

  it('both shaking one tree drops an avalanche of three fruit', () => {
    const w = coop();
    w.nubbins = [];
    const t = w.trees[0]!;
    w.keeper2!.pos = { x: t.pos.x + 1, z: t.pos.z };
    const ev: SimEvent[] = [];
    const before = w.items.length;
    applyCommand(w, { kind: 'keeper2Act', action: 'shake' }, ev);
    expect(gags(ev, 'avalanche').length).toBe(0);
    steps(w, 2, ev);
    w.keeper.pos = { x: t.pos.x - 1, z: t.pos.z };
    noteCoopShake(w, t, 1, ev);
    expect(gags(ev, 'avalanche').length).toBe(1);
    expect(w.items.length - before).toBeGreaterThanOrEqual(3);
  });

  it('bumping Keepers bow once per cooldown', () => {
    const w = coop();
    w.nubbins = [];
    w.keeper2!.pos = { x: w.keeper.pos.x + 0.3, z: w.keeper.pos.z };
    const ev = steps(w, 3);
    expect(gags(ev, 'bow').length).toBe(1);
  });
});
