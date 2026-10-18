import { describe, expect, it } from 'vitest';
import { GATHER, OFFLINE } from '../../src/config/tuning';
import { gather } from '../../src/sim/craft';
import { depart, memorialForm } from '../../src/sim/lifecycle';
import { deserialize, SaveError, serialize } from '../../src/sim/save';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/**
 * Review B, minor bugs 18, 34 and 36: memorials keep their form, the gathering cooldown
 * lives in the world, and a hand-edited save or a settings command cannot slip junk in.
 */

function roundTrip(w: World, edit: (raw: Record<string, unknown>) => void): World {
  const raw = JSON.parse(serialize(w, 0)) as { world: Record<string, unknown> };
  edit(raw.world);
  return deserialize(JSON.stringify(raw)).world;
}

function adult(w: World): Nubbin {
  const n = w.nubbins[0]!;
  n.stage = 'adult';
  n.form = { band: 'moon', type: 'fly', second: null, leanAtEvolution: { ...n.typeLean } };
  return n;
}

describe('memorial forms (bug 18)', () => {
  it('names the band and type, the Eternal band, or a child', () => {
    const w = createWorld(4, 0);
    const n = adult(w);
    expect(memorialForm(n)).toBe('moon:fly');
    n.eternal = 'sun';
    expect(memorialForm(n)).toBe('eternal:sun');
    n.eternal = null;
    n.form = null;
    expect(memorialForm(n)).toBe('child');
  });

  it('writes the form into the memorial a departure leaves', () => {
    const w = createWorld(4, 0);
    const n = adult(w);
    const events: SimEvent[] = [];
    depart(n, events, w);
    expect(w.memorials[0]?.form).toBe('moon:fly');
  });

  it('forgets the empty forms older saves wrote', () => {
    const w = createWorld(4, 0);
    const loaded = roundTrip(w, (raw) => {
      raw.memorials = [
        { id: 'memorial-a', name: 'Juniper', pos: { x: 0, z: 0 }, form: ':' },
        { id: 'memorial-b', name: 'Bibi', pos: { x: 1, z: 0 }, form: 'eternal:' },
        { id: 'memorial-c', name: 'Pip', pos: { x: 2, z: 0 }, form: 'sun:run' },
      ];
    });
    expect(loaded.memorials.map((m) => m.form)).toEqual([undefined, undefined, 'sun:run']);
  });
});

describe('gathering cooldown (bug 34)', () => {
  it('belongs to the world, so a fresh world can gather at once', () => {
    const events: SimEvent[] = [];
    const a = createWorld(1, 0);
    a.timeMs = 50_000_000;
    expect(gather(a, 'stone', events)).toBe(true);
    expect(gather(a, 'stone', events)).toBe(false);
    a.timeMs += GATHER.tapCooldownMs;
    expect(gather(a, 'reeds', events)).toBe(true);
    // A reset in the same page: the new world's clock starts at 0.
    const b = createWorld(2, 0);
    expect(gather(b, 'stone', events)).toBe(true);
  });

  it('survives a save round trip', () => {
    const w = createWorld(1, 0);
    gather(w, 'stone', []);
    const loaded = deserialize(serialize(w, 0)).world;
    expect(gather(loaded, 'stone', [])).toBe(false);
  });
});

describe('imported fields (bug 36)', () => {
  it('turns string and junk counts into whole numbers', () => {
    const w = createWorld(1, 0);
    const loaded = roundTrip(w, (raw) => {
      const inv = raw.inventory as Record<string, unknown>;
      inv.shells = '5';
      inv.fruit = 'lots';
      inv.wood = -3;
      inv.critters = { minnow: '2', junk: null };
    });
    expect(loaded.inventory.shells).toBe(5);
    loaded.inventory.shells += 1;
    expect(loaded.inventory.shells).toBe(6);
    expect(loaded.inventory.fruit).toBe(0);
    expect(loaded.inventory.wood).toBe(0);
    expect(loaded.inventory.critters).toEqual({ minnow: 2, junk: 0 });
  });

  it('refuses a world whose clock is missing or not a number', () => {
    const w = createWorld(1, 0);
    expect(() => roundTrip(w, (raw) => (raw.timeMs = null))).toThrow(SaveError);
    expect(() => roundTrip(w, (raw) => (raw.timeMs = 'soon'))).toThrow(SaveError);
    expect(() => roundTrip(w, (raw) => delete raw.timeMs)).toThrow(SaveError);
  });

  it('keeps the old cap when a settings command carries a bad one', () => {
    const w = createWorld(1, 0);
    w.settings.offlineAging.capHours = 12;
    for (const cap of [NaN, 0, OFFLINE.maxCapHours + 1, 2.5]) {
      const settings = {
        ...w.settings,
        offlineAging: { ...w.settings.offlineAging, capHours: cap },
      };
      applyCommand(w, { kind: 'setSettings', settings }, []);
      expect(w.settings.offlineAging.capHours).toBe(12);
    }
    const good = { ...w.settings, offlineAging: { ...w.settings.offlineAging, capHours: 24 } };
    applyCommand(w, { kind: 'setSettings', settings: good }, []);
    expect(w.settings.offlineAging.capHours).toBe(24);
  });
});
