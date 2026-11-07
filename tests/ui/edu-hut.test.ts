import { describe, expect, it } from 'vitest';
import { EDU_HUT } from '../../src/config/edu-hut';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { Nubbin, World } from '../../src/sim/types';
import { deskNubbins, HUT_DOOR, hutEntered, hutStep, type HutWatch } from '../../src/ui/edu-hut';

const AT_DOOR = { x: HUT_DOOR.x, z: HUT_DOOR.z };
const FAR = { x: HUT_DOOR.x + 12, z: HUT_DOOR.z + 12 };

function eduWorld(): World {
  const w = createWorld(1, 0);
  applyCommand(w, { kind: 'eduStart', age: 5 }, []);
  return w;
}

function at(w: World, p: { x: number; z: number }): void {
  w.keeper.pos = { ...p };
}

describe('R0742 (KIDS-74) the Kindergarten hut opens Play and learn', () => {
  it('the door spot sits in front of the school footprint', () => {
    expect(Number.isFinite(HUT_DOOR.x)).toBe(true);
    expect(HUT_DOOR.r).toBe(EDU_HUT.enterR);
  });

  it('hutEntered fires on arrival only, and needs a wider ring to leave', () => {
    expect(hutEntered(FAR, HUT_DOOR, false)).toEqual({ inside: false, fire: false });
    expect(hutEntered(AT_DOOR, HUT_DOOR, false)).toEqual({ inside: true, fire: true });
    expect(hutEntered(AT_DOOR, HUT_DOOR, true)).toEqual({ inside: true, fire: false });
    // Just outside the enter radius but inside the leave ring: still "inside", no re-fire.
    const edge = { x: HUT_DOOR.x + HUT_DOOR.r + EDU_HUT.leaveExtra / 2, z: HUT_DOOR.z };
    expect(hutEntered(edge, HUT_DOOR, true)).toEqual({ inside: true, fire: false });
    expect(hutEntered(edge, HUT_DOOR, false)).toEqual({ inside: false, fire: false });
    expect(hutEntered(FAR, HUT_DOOR, true).inside).toBe(false);
  });

  it('in edu, walking in opens once, then needs leaving before it opens again', () => {
    const w = eduWorld();
    const watch: HutWatch = { inside: true };
    at(w, FAR);
    expect(hutStep(watch, w, false)).toBe(false);
    at(w, AT_DOOR);
    expect(hutStep(watch, w, false)).toBe(true);
    // Standing there, or the picker closing while the Keeper stays, does not re-open it.
    expect(hutStep(watch, w, false)).toBe(false);
    expect(hutStep(watch, w, false)).toBe(false);
    at(w, FAR);
    expect(hutStep(watch, w, false)).toBe(false);
    at(w, AT_DOOR);
    expect(hutStep(watch, w, false)).toBe(true);
  });

  it('a Keeper already at the door on load does not open it until they come back', () => {
    const w = eduWorld();
    const watch: HutWatch = { inside: true };
    at(w, AT_DOOR);
    expect(hutStep(watch, w, false)).toBe(false);
    at(w, FAR);
    hutStep(watch, w, false);
    at(w, AT_DOOR);
    expect(hutStep(watch, w, false)).toBe(true);
  });

  it('never opens while a dialog is open, and an arrival then is swallowed', () => {
    const w = eduWorld();
    const watch: HutWatch = { inside: true };
    at(w, FAR);
    hutStep(watch, w, false);
    at(w, AT_DOOR);
    expect(hutStep(watch, w, true)).toBe(false);
    // The dialog closes with the Keeper still there: no pop-up.
    expect(hutStep(watch, w, false)).toBe(false);
  });

  it('never opens in the main game (no edu)', () => {
    const w = createWorld(1, 0);
    expect(w.edu).toBeFalsy();
    const watch: HutWatch = { inside: true };
    at(w, FAR);
    expect(hutStep(watch, w, false)).toBe(false);
    at(w, AT_DOOR);
    expect(hutStep(watch, w, false)).toBe(false);
    at(w, FAR);
    at(w, AT_DOOR);
    expect(hutStep(watch, w, false)).toBe(false);
  });

  it('never opens away from the Grove', () => {
    const w = eduWorld();
    const watch: HutWatch = { inside: true };
    at(w, FAR);
    hutStep(watch, w, false);
    w.location = 'dungeon';
    at(w, AT_DOOR);
    expect(hutStep(watch, w, false)).toBe(false);
  });
});

describe('R0742 the Nubbins at their desks', () => {
  const mk = (id: string, stage: string): Nubbin => ({ id, stage }) as unknown as Nubbin;

  it("puts the child's own Nubbin first, skips eggs and the guest, and caps at four", () => {
    const world = {
      campaign: { sableId: 'guest' },
      nubbins: [
        mk('egg1', 'egg'),
        mk('guest', 'child'),
        mk('own', 'child'),
        mk('b', 'child'),
        mk('c', 'adult'),
        mk('d', 'child'),
        mk('e', 'child'),
      ],
    } as unknown as World;
    const ids = deskNubbins(world).map((n) => n.id);
    expect(ids[0]).toBe('own');
    expect(ids).toHaveLength(EDU_HUT.maxDesks);
    expect(ids).not.toContain('egg1');
    expect(deskNubbins(world, 2)).toHaveLength(2);
  });

  it('is empty when nothing has hatched', () => {
    const world = { nubbins: [mk('egg1', 'egg')] } as unknown as World;
    expect(deskNubbins(world)).toEqual([]);
  });
});
