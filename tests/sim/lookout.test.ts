import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { LOOKOUT } from '../../src/config/tuning-move';
import { keeperFooting } from '../../src/sim/keeper';
import { lookoutHere } from '../../src/sim/lookout';
import { deserialize, serialize } from '../../src/sim/save';
import { groveHeight } from '../../src/sim/terrain';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// MOVE-55: "Look around" from a standable top, and the well's one-time find.

function standOn(w: World, x: number, z: number, fromY = Infinity): void {
  w.keeper.pos = { x, z };
  w.keeper.y = keeperFooting(w, x, z, fromY).y;
  w.keeper.grounded = true;
}

const look = (w: World): SimEvent[] => {
  const ev: SimEvent[] = [];
  applyCommand(w, { kind: 'lookAround' }, ev);
  return ev;
};

describe('lookouts (MOVE-55)', () => {
  it('the big rock at (-7, 9) is a lookout; the grass beside it is not', () => {
    const w = createWorld(1, 0);
    standOn(w, -7, 9);
    expect(w.keeper.y - groveHeight(-7, 9)).toBeGreaterThanOrEqual(LOOKOUT.minTop);
    expect(lookoutHere(w)).toBe('top');
    standOn(w, -7, 7);
    expect(lookoutHere(w)).toBeNull();
  });

  it('looking round finds each vista in range once', () => {
    const w = createWorld(1, 0);
    standOn(w, -7, 9);
    const shells = w.inventory.shells;
    const first = look(w).filter((e) => e.kind === 'lookoutFind');
    expect(first.length).toBeGreaterThan(0);
    expect(w.inventory.shells).toBeGreaterThan(shells);
    const again = look(w);
    expect(again.some((e) => e.kind === 'lookoutFind')).toBe(false);
    expect(again).toContainEqual({ kind: 'lookedAround', at: 'top', found: false });
  });

  it('the well find happens once per save, across a save and load', () => {
    const w = createWorld(1, 0);
    const well = GROVE.buildings.well;
    standOn(w, well.x, well.z - well.r - 0.4);
    expect(lookoutHere(w)).toBe('well');
    const before = w.inventory.shells;
    expect(look(w).some((e) => e.kind === 'lookoutFind' && e.id === 'well')).toBe(true);
    expect(w.inventory.shells).toBe(before + LOOKOUT.wellShells);
    const back = deserialize(serialize(w, 0)).world;
    expect(look(back).some((e) => e.kind === 'lookoutFind')).toBe(false);
    expect(back.inventory.shells).toBe(before + LOOKOUT.wellShells);
  });
});
