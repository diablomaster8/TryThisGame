import { describe, expect, it } from 'vitest';
import { cosmetic } from '../../src/config/cosmetics';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import { normaliseWear, wornExtras, wornIn } from '../../src/sim/wear';
import { applyCommand, createWorld } from '../../src/sim/world';

function worldWithNubbin() {
  const world = createWorld(1, 0);
  const n = createEgg('n1', { x: 0, z: 0 }, new Rng(1));
  n.stage = 'child';
  world.nubbins.push(n);
  world.inventory.hats.push('bell', 'sunglasses', 'cape', 'party');
  return { world, n };
}

describe('per-slot wear (R0400)', () => {
  it('wears one item per slot and takes a slot off alone', () => {
    const { world, n } = worldWithNubbin();
    const ev: never[] = [];
    applyCommand(world, { kind: 'wearSlot', nubbinId: n.id, slot: 'hat', id: 'party' }, ev);
    applyCommand(world, { kind: 'wearSlot', nubbinId: n.id, slot: 'face', id: 'sunglasses' }, ev);
    applyCommand(world, { kind: 'wearSlot', nubbinId: n.id, slot: 'back', id: 'cape' }, ev);
    expect(n.hat).toBe('party');
    expect(wornIn(n, 'face')).toBe('sunglasses');
    expect(wornExtras(n)).toEqual(['sunglasses', 'cape']);
    applyCommand(world, { kind: 'wearSlot', nubbinId: n.id, slot: 'face', id: null }, ev);
    expect(wornExtras(n)).toEqual(['cape']);
    expect(n.hat).toBe('party');
  });

  it('refuses an item for the wrong slot or one that is not owned', () => {
    const { world, n } = worldWithNubbin();
    const ev: never[] = [];
    applyCommand(world, { kind: 'wearSlot', nubbinId: n.id, slot: 'hat', id: 'cape' }, ev);
    applyCommand(
      world,
      { kind: 'wearSlot', nubbinId: n.id, slot: 'neck', id: 'heart-glasses' },
      ev,
    );
    expect(n.hat).toBeNull();
    expect(n.wear).toBeUndefined();
  });

  it('routes a wearHat of a non-hat item to its own slot', () => {
    const { world, n } = worldWithNubbin();
    applyCommand(world, { kind: 'wearHat', nubbinId: n.id, hat: 'bell' }, []);
    expect(n.hat).toBeNull();
    expect(n.wear?.[cosmetic('bell')!.slot as 'neck']).toBe('bell');
  });

  it('migrates an old save: a misplaced item moves, hat, scarf and glasses stay', () => {
    const { world, n } = worldWithNubbin();
    n.hat = 'cape';
    n.scarf = 'rose';
    n.glasses = true;
    const back = deserialize(serialize(world, 0)).world;
    const m = back.nubbins.find((x) => x.id === 'n1')!;
    expect(m.hat).toBeNull();
    expect(m.wear).toEqual({ back: 'cape' });
    expect(wornIn(m, 'face')).toBe('glasses');
    expect(wornIn(m, 'neck')).toBe('scarf');
    const keep = worldWithNubbin();
    keep.n.hat = 'party';
    normaliseWear(keep.world);
    expect(keep.n.hat).toBe('party');
  });
});

describe('body costumes (R0413)', () => {
  it('wears a costume in the body slot and recolours through costumeOf', async () => {
    const { costumeOf } = await import('../../src/sim/wear');
    const { world, n } = worldWithNubbin();
    world.inventory.hats.push('costume-frog', 'costume-ghost');
    applyCommand(world, { kind: 'wearSlot', nubbinId: n.id, slot: 'body', id: 'costume-frog' }, []);
    expect(costumeOf(n)?.id).toBe('costume-frog');
    expect(costumeOf(n)?.costume?.body).toBe('leaf');
    applyCommand(world, { kind: 'wearSlot', nubbinId: n.id, slot: 'hat', id: 'costume-ghost' }, []);
    expect(n.hat).toBeNull();
  });
});

describe('race headbands (R0437)', () => {
  it('has one face-slot headband per course, none for an unknown one', async () => {
    const { raceBandId } = await import('../../src/config/cosmetics-r11e');
    const { COURSES } = await import('../../src/sim/race');
    for (const c of COURSES) {
      const id = raceBandId(c.id);
      expect(id, c.id).toBeTruthy();
      expect(cosmetic(id!)?.slot).toBe('face');
    }
    expect(raceBandId('nowhere')).toBeNull();
  });
});
