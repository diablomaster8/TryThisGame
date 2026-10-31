import { describe, expect, it } from 'vitest';
import { cosmetic } from '../../src/config/cosmetics';
import { REMEMBRANCE_HAT } from '../../src/config/cosmetics-r9e';
import { FRIENDS } from '../../src/config/tuning';
import { depart } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** R0424 (LOOK-54): the remembrance flower for a departed Nubbin's bonded friends. */
describe('remembrance flower', () => {
  it('goes to bonded friends only, and only they may wear it', () => {
    const w = createWorld(11, 0);
    const [a, b] = w.nubbins;
    expect(a && b).toBeTruthy();
    const c = structuredClone(b!);
    c.id = 'third';
    c.name = 'Third';
    w.nubbins.push(c);
    a!.name = 'Pip';
    a!.friends = { [b!.id]: FRIENDS.buddyAt, third: 1 };
    const ev: SimEvent[] = [];
    depart(a!, ev, w);
    expect(ev).toContainEqual({ kind: 'remembrance', nubbinId: b!.id, friend: 'Pip' });
    expect(ev.some((e) => e.kind === 'remembrance' && e.nubbinId === 'third')).toBe(false);
    expect(b!.remembers).toEqual(['Pip']);
    expect(w.inventory.hats).toContain(REMEMBRANCE_HAT);
    expect(cosmetic(REMEMBRANCE_HAT)?.px?.length).toBeGreaterThan(0);
    expect(cosmetic(REMEMBRANCE_HAT)?.mesh?.length).toBeGreaterThan(0);
    applyCommand(w, { kind: 'wearHat', nubbinId: 'third', hat: REMEMBRANCE_HAT }, []);
    expect(c.hat).toBeNull();
    applyCommand(w, { kind: 'wearHat', nubbinId: b!.id, hat: REMEMBRANCE_HAT }, []);
    expect(b!.hat).toBe(REMEMBRANCE_HAT);
  });
});
