import { describe, expect, it } from 'vitest';
import { FUSION } from '../../src/config/tuning';
import { canFuse, fuse, fusedFrom } from '../../src/sim/fusion';
import { hatch } from '../../src/sim/lifecycle';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function pair(): { world: World; a: Nubbin; b: Nubbin; events: SimEvent[] } {
  const world = createWorld(8, 0);
  const events: SimEvent[] = [];
  const [a, b] = world.nubbins as [Nubbin, Nubbin];
  for (const n of [a, b]) {
    hatch(n, events, 0);
    n.stage = 'adult';
    n.needs.affection = 100;
    n.trust = 90;
  }
  return { world, a, b, events };
}

describe('fusion', () => {
  it('asks for two adults, both bonded and trusting, and never an Eternal', () => {
    const { world, a, b } = pair();
    expect(canFuse(world, a.id, a.id)).toBe('two');
    b.stage = 'child';
    expect(canFuse(world, a.id, b.id)).toBe('adults');
    b.stage = 'adult';
    b.needs.affection = FUSION.minAffection - 1;
    expect(canFuse(world, a.id, b.id)).toBe('bond');
    b.needs.affection = 100;
    a.trust = FUSION.minTrust - 1;
    expect(canFuse(world, a.id, b.id)).toBe('trust');
    a.trust = 90;
    a.eternal = 'neutral';
    expect(canFuse(world, a.id, b.id)).toBe('eternal');
    a.eternal = null;
    expect(canFuse(world, a.id, b.id)).toBeNull();
  });

  it('keeps the better of everything, remembers the other, and removes it from the roster', () => {
    const { world, a, b, events } = pair();
    a.stats.power.points = 500;
    b.stats.power.points = 900;
    a.stats.swim.grade = 'A';
    b.stats.swim.grade = 'C';
    b.stats.fly.grade = 'S';
    a.parts.ears = 'rabbit-ears';
    b.parts.ears = 'bat-ears';
    b.parts.tail = 'fox-tail';
    b.typeLean.fly = 40;
    world.partners = [a.id, b.id];
    const bName = b.name;
    expect(fuse(world, a.id, b.id, events)).toBe(true);
    expect(world.nubbins.map((n) => n.id)).toEqual([a.id]);
    expect(a.stats.power.points).toBe(900);
    expect(a.stats.swim.grade).toBe('A');
    expect(a.stats.fly.grade).toBe('S');
    expect(a.parts.ears).toBe('rabbit-ears');
    expect(a.parts.tail).toBe('fox-tail');
    expect(a.typeLean.fly).toBeGreaterThanOrEqual(40);
    expect(a.generation).toBe(1);
    expect(fusedFrom(a)).toEqual([bName]);
    expect(a.ancestry).toContain(bName);
    expect(world.partners).toEqual([a.id, null]);
    expect(events.some((e) => e.kind === 'fused' && e.goneName === bName)).toBe(true);
    // A second call has nothing to fuse with.
    expect(fuse(world, a.id, b.id, events)).toBe(false);
  });

  it('runs from the fuse command on the two partners only', () => {
    const { world, a, b, events } = pair();
    applyCommand(world, { kind: 'fuse' }, events);
    expect(world.nubbins.length).toBe(2);
    applyCommand(world, { kind: 'setPartner', slot: 0, nubbinId: a.id }, events);
    applyCommand(world, { kind: 'setPartner', slot: 1, nubbinId: b.id }, events);
    applyCommand(world, { kind: 'fuse' }, events);
    expect(world.nubbins.length).toBe(1);
  });
});
