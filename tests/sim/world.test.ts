import { describe, expect, it } from 'vitest';
import { BEHAVIOR, EGG, GROVE, SIM, UI } from '../../src/config/tuning';
import {
  deserialize,
  SAVE_VERSION,
  serialize,
  SaveError,
  worldFingerprint,
} from '../../src/sim/save';
import type { Command, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function run(world: World, steps: number, cmds: Command[] = []): SimEvent[] {
  const events: SimEvent[] = [];
  for (const c of cmds) applyCommand(world, c, events);
  for (let i = 0; i < steps; i++) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

describe('world', () => {
  it('starts with two eggs, two trees and a Keeper', () => {
    const w = createWorld(1, 0);
    expect(w.nubbins).toHaveLength(2);
    expect(w.nubbins.every((n) => n.stage === 'egg')).toBe(true);
    expect(w.trees).toHaveLength(GROVE.trees.length);
    expect(w.keeper.pos).toBeDefined();
  });

  it('is deterministic for the same seed and commands', () => {
    const a = createWorld(123, 0);
    const b = createWorld(123, 0);
    const cmds: Command[] = [{ kind: 'moveKeeperTo', pos: { x: 3, z: 3 } }];
    run(a, 3000, cmds);
    run(b, 3000, cmds);
    expect(worldFingerprint(a)).toBe(worldFingerprint(b));
  });

  it('hatches eggs after 3 minutes', () => {
    const w = createWorld(5, 0);
    const steps = EGG.hatchMs / SIM.stepMs;
    const events = run(w, steps);
    expect(events.filter((e) => e.kind === 'hatched')).toHaveLength(2);
    expect(w.nubbins.every((n) => n.stage === 'child')).toBe(true);
  });

  it('a new hatchling can be fed straight away (TECH-01)', () => {
    const w = createWorld(5, 0);
    run(w, EGG.hatchMs / SIM.stepMs);
    expect(w.nubbins.every((n) => n.needs.hunger < UI.feedFullAt)).toBe(true);
  });

  it('shaking a held egg speeds hatching', () => {
    const w = createWorld(5, 0);
    const egg = w.nubbins[0]!;
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'grab', nubbinId: egg.id }, events);
    const shakes = Math.ceil(EGG.hatchMs / EGG.shakeBonusMs);
    for (let i = 0; i < shakes; i++) {
      applyCommand(w, { kind: 'shakeHeld' }, events);
      run(w, Math.ceil(EGG.shakeCooldownMs / SIM.stepMs));
    }
    // TECH-18: shaking alone hatches it, in the Keeper's arms.
    run(w, 1);
    expect(egg.stage).toBe('child');
  });

  it('the Keeper walks to a Nubbin and pets it', () => {
    const w = createWorld(9, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 5);
    const n = w.nubbins[0]!;
    const before = n.needs.affection;
    // Step until the hand lands: the Nubbin then holds the pet pose, facing the Keeper.
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'pet', nubbinId: n.id }, events);
    for (let i = 0; i < 100 && !events.some((e) => e.kind === 'reaction'); i++)
      events.push(...stepWorld(w, SIM.stepMs));
    expect(n.needs.affection).toBeGreaterThan(before);
    expect(n.alignment).toBeGreaterThan(0);
    expect(events.some((e) => e.kind === 'reaction' && e.reaction === 'love')).toBe(true);
    expect(n.behavior.state).toBe('pet');
    const toKeeper = Math.atan2(w.keeper.pos.x - n.pos.x, w.keeper.pos.z - n.pos.z);
    expect(Math.abs(n.facing - toKeeper)).toBeLessThan(0.01);
    // Then it goes back to its day.
    run(w, BEHAVIOR.petMs / SIM.stepMs + 2);
    expect(n.behavior.state).not.toBe('pet');
  });

  it('direct input stops the Keeper at the shoreline too', () => {
    const w = createWorld(9, 0);
    w.keeper.pos = { x: GROVE.pond.x - GROVE.pond.r - 2, z: GROVE.pond.z };
    w.keeper.input = { x: 1, z: 0 };
    run(w, 100);
    const d = Math.hypot(w.keeper.pos.x - GROVE.pond.x, w.keeper.pos.z - GROVE.pond.z);
    expect(d).toBeGreaterThanOrEqual(GROVE.pond.r);
    expect(d).toBeLessThan(GROVE.pond.r + 1.5);
  });

  it('the Keeper stops at the shoreline instead of wading', () => {
    const w = createWorld(9, 0);
    run(w, 200, [{ kind: 'moveKeeperTo', pos: { x: GROVE.pond.x, z: GROVE.pond.z } }]);
    const d = Math.hypot(w.keeper.pos.x - GROVE.pond.x, w.keeper.pos.z - GROVE.pond.z);
    expect(d).toBeGreaterThanOrEqual(GROVE.pond.r);
    expect(d).toBeLessThan(GROVE.pond.r + 1.5);
  });

  it('feeding from the inventory fills hunger', () => {
    const w = createWorld(9, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 5);
    const n = w.nubbins[0]!;
    n.needs.hunger = 0.2;
    applyCommand(w, { kind: 'debugGive', what: 'fruit', amount: 1 }, []);
    run(w, 100, [{ kind: 'feed', nubbinId: n.id }]);
    expect(w.inventory.fruit).toBe(EGG.startFruit);
    expect(n.needs.hunger).toBeGreaterThan(0.6);
  });

  it('a thrown Nubbin lands, loses happiness and gets dizzy', () => {
    const w = createWorld(9, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 5);
    const n = w.nubbins[0]!;
    const before = n.needs.happiness;
    const events = run(w, 60, [
      { kind: 'grab', nubbinId: n.id },
      { kind: 'release', vel: { x: 8, z: 0 } },
    ]);
    expect(events.some((e) => e.kind === 'thrown')).toBe(true);
    expect(events.some((e) => e.kind === 'landed')).toBe(true);
    expect(n.y).toBe(0);
    expect(n.needs.happiness).toBeLessThan(before);
    expect(n.behavior.state).not.toBe('thrown');
    expect(n.behavior.state).not.toBe('held');
  });

  it('a gentle release puts the Nubbin down and frees it', () => {
    const w = createWorld(9, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 5);
    const n = w.nubbins[0]!;
    run(w, 1, [
      { kind: 'grab', nubbinId: n.id },
      { kind: 'drag', pos: { x: 3, z: 3 } },
    ]);
    expect(n.behavior.state).toBe('held');
    expect(n.y).toBeGreaterThan(0);
    run(w, 1, [{ kind: 'release', vel: { x: 0, z: 0 } }]);
    expect(n.behavior.state).not.toBe('held');
    expect(n.y).toBe(0);
    expect(n.pos).toEqual({ x: 3, z: 3 });
    // And it goes back to living its life.
    run(w, 100);
    expect(['wander', 'sit', 'greet', 'swim', 'findFood', 'react', 'nap', 'cry']).toContain(
      n.behavior.state,
    );
  });

  it('a still release is free, a slow one a half drop, a fast one a throw (TECH-02)', () => {
    const w = createWorld(9, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 5);
    const n = w.nubbins[0]!;
    const release = (x: number) => {
      run(w, 1, [{ kind: 'grab', nubbinId: n.id }]);
      run(w, 2);
      const before = { happiness: n.needs.happiness, trust: n.trust };
      applyCommand(w, { kind: 'release', vel: { x, z: 0 } }, []);
      return before;
    };
    let before = release(0);
    expect(n.needs.happiness).toBe(before.happiness);
    expect(n.trust).toBe(before.trust);
    before = release(2);
    expect(n.needs.happiness).toBeLessThan(before.happiness);
    expect(n.trust).toBeLessThan(before.trust);
    release(5);
    expect(n.behavior.state).toBe('thrown');
  });

  it('trees drop fruit and hungry Nubbins go eat it', () => {
    const w = createWorld(21, 0);
    run(w, EGG.hatchMs / SIM.stepMs + 5);
    for (const n of w.nubbins) n.needs.hunger = 0.2;
    const events = run(w, 10 * 60 * 10);
    expect(events.some((e) => e.kind === 'fruitDropped')).toBe(true);
    expect(events.some((e) => e.kind === 'ate')).toBe(true);
  });

  it('survives 8 Nubbins for an hour at full fidelity in reasonable time', () => {
    const w = createWorld(77, 0);
    const events: SimEvent[] = [];
    for (let i = 0; i < 6; i++) {
      applyCommand(w, { kind: 'debugGive', what: 'fruit', amount: 0 }, events);
    }
    // Clone eggs to reach the roster cap.
    while (w.nubbins.length < 8) {
      const src = w.nubbins[0]!;
      w.nubbins.push({ ...structuredClone(src), id: `nub-x${w.nubbins.length}` });
    }
    const start = performance.now();
    run(w, 36_000);
    expect(performance.now() - start).toBeLessThan(3000);
    expect(w.nubbins.every((n) => n.stage === 'child' || n.stage === 'cocoon')).toBe(true);
  });
});

describe('save', () => {
  it('round-trips exactly', () => {
    const w = createWorld(31, 1000);
    run(w, 500, [{ kind: 'moveKeeperTo', pos: { x: -2, z: 4 } }]);
    const json = serialize(w, 123456);
    const loaded = deserialize(json);
    expect(loaded.version).toBe(SAVE_VERSION);
    expect(loaded.savedAtWallMs).toBe(123456);
    expect(worldFingerprint(loaded.world)).toBe(worldFingerprint(w));
    // And it keeps simulating identically.
    run(w, 500);
    run(loaded.world, 500);
    expect(worldFingerprint(loaded.world)).toBe(worldFingerprint(w));
  });

  it('rejects garbage and unknown versions', () => {
    expect(() => deserialize('nope')).toThrow(SaveError);
    expect(() => deserialize('{"version":99,"world":{}}')).toThrow(SaveError);
    expect(() => deserialize('{"version":1}')).toThrow(SaveError);
  });

  it('defaults missing optional fields and drops in-hand state', () => {
    const w = createWorld(2, 0);
    const n = w.nubbins[0]!;
    n.behavior.state = 'held';
    n.y = 1;
    const raw = JSON.parse(serialize(w, 0)) as { world: Record<string, unknown> };
    delete raw.world.items;
    delete raw.world.settings;
    const loaded = deserialize(JSON.stringify(raw)).world;
    expect(loaded.items).toEqual([]);
    expect(loaded.settings.offlineAging.mode).toBe('capped');
    expect(loaded.nubbins[0]!.behavior.state).toBe('sit');
    expect(loaded.nubbins[0]!.y).toBe(0);
  });

  it('repairs an out-of-range cap', () => {
    const w = createWorld(2, 0);
    w.settings.offlineAging.capHours = 5000;
    const loaded = deserialize(serialize(w, 0)).world;
    expect(loaded.settings.offlineAging.capHours).toBe(8);
  });
});
