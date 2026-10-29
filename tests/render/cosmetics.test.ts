import { Group } from 'three';
import { describe, expect, it } from 'vitest';
import {
  COSMETICS,
  cosmetic,
  cosmeticLabel,
  eggshellId,
  SHOP_COSMETICS,
} from '../../src/config/cosmetics';
import { EGGSHELL, LOOK_SHOP } from '../../src/config/tuning';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from '../../src/render/sprites/chao';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { EGG_PALETTES } from '../../src/render/sprites/egg';
import { DRESS_HATS, Dresser, registryItem } from '../../src/render3d/dress';
import { LOOK_PRIZES } from '../../src/minigames/race/screen';
import { advanceStage, hatch } from '../../src/sim/lifecycle';
import { createEgg, JEWEL_EGG_COLORS } from '../../src/sim/nubbin';
import { lookPrizesFor } from '../../src/sim/race';
import { Rng } from '../../src/sim/rng';
import { buy, shopHat } from '../../src/sim/shop';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Rigged } from '../../src/samples/species';

/** The cosmetics registry (LOOK-32), the eggshell (LOOK-26) and the hero looks (LOOK-27). */

const drawn = (hat: string | null) => {
  const out: number[] = [];
  for (const a of DRAWN_ANGLES) {
    const pc = drawChao(a, poseFor('idle', 0), { ...lookOf(CHILD_NEUTRAL), hat });
    out.push(...pc.data);
  }
  return out;
};

const rig = (): Rigged =>
  ({
    group: Object.assign(new Group(), { userData: { lookKey: 'variant:child' } }),
    bones: { head: new Group(), hips: new Group() },
  }) as unknown as Rigged;

describe('the cosmetics registry', () => {
  it('seeds 24 wearables with unique ids, names and every slot but body costumes', () => {
    const ids = COSMETICS.map((c) => c.id).filter((id) => !id.startsWith('look-'));
    // The five hats, eighteen new ones and the eggshell.
    expect(ids.length + 1).toBe(24);
    expect(new Set(COSMETICS.map((c) => c.id)).size).toBe(COSMETICS.length);
    for (const c of COSMETICS) expect(c.label).not.toBe(c.id);
    const slots = new Set(COSMETICS.map((c) => c.slot));
    for (const s of ['hat', 'neck', 'back', 'body']) expect(slots.has(s as never)).toBe(true);
  });

  it('every wearable draws in Pixel and in Full 3D', () => {
    const bare = drawn(null);
    for (const c of [...COSMETICS, cosmetic(eggshellId('sky'))!]) {
      expect(drawn(c.id), c.id).not.toEqual(bare);
      expect(c.bespoke ? DRESS_HATS.includes(c.id) : registryItem(c.id) !== null, c.id).toBe(true);
    }
  });

  it('the Dresser hangs each registry wearable on one bone', () => {
    const d = new Dresser();
    for (const c of COSMETICS.filter((x) => !x.bespoke)) {
      const r = rig();
      d.update(r, {
        ...createEgg('n', { x: 0, z: 0 }, new Rng(1)),
        stage: 'child',
        hat: c.id,
      });
      const bones = r.bones as { head: Group; hips: Group };
      expect(bones.head.children.length + bones.hips.children.length, c.id).toBe(1);
      expect(
        (c.slot === 'back' || c.slot === 'body' ? bones.hips : bones.head).children.length,
      ).toBe(1);
    }
    d.dispose();
  });

  it('the shop shows the hat of the day and sells exactly that', () => {
    const world = createWorld(5, 0);
    world.inventory.shells = 10_000;
    const today = shopHat(world);
    expect(SHOP_COSMETICS).toContain(today);
    expect(buy(world, 'hat', new Rng(2), [])).toBe(true);
    expect(world.inventory.hats).toContain(today);
    // Owned ones are skipped; tomorrow brings another.
    expect(shopHat(world)).not.toBe(today);
    world.timeMs += LOOK_SHOP.hatDayMs;
    expect(SHOP_COSMETICS).toContain(shopHat(world));
  });
});

describe('the eggshell hat', () => {
  it('has a name and a shape for every egg colour, jewels included', () => {
    for (const colour of [...Object.keys(EGG_PALETTES), ...JEWEL_EGG_COLORS]) {
      expect(cosmeticLabel(eggshellId(colour))).toContain(colour);
      expect(registryItem(eggshellId(colour))).not.toBeNull();
    }
    expect(drawn(eggshellId('ruby'))).not.toEqual(drawn(eggshellId('plain')));
  });

  it('a hatchling wears its shell, keeps it, and takes it off after live play only', () => {
    const world = createWorld(7, 0);
    const n = createEgg('nub-x', { x: 0, z: 0 }, new Rng(3), 'sky');
    world.nubbins.push(n);
    hatch(n, []);
    expect(n.hat).toBe('shell:sky');
    advanceStage(n, 1000, [], world, true);
    // A catch-up or story hatch: into the hat box when it comes off, not before.
    expect(world.inventory.hats).not.toContain('shell:sky');
    // Catch-up never counts it down.
    advanceStage(n, EGGSHELL.wearMs * 2, [], world, true);
    expect(n.hat).toBe('shell:sky');
    for (let t = 0; t < EGGSHELL.wearMs; t += 60_000) advanceStage(n, 60_000, [], world);
    expect(n.hat).toBeNull();
    expect(n.shellMs).toBeUndefined();
    expect(world.inventory.hats).toContain('shell:sky');
  });

  it('a live hatch puts the shell in the hat box at once', () => {
    const world = createWorld(9, 0);
    world.inventory.shells = 10_000;
    const n = createEgg('nub-z', { x: 0, z: 0 }, new Rng(6), 'gold');
    n.hatchRemainingMs = 0;
    world.nubbins.push(n);
    stepWorld(world, 100);
    expect(n.hat).toBe('shell:gold');
    expect(world.inventory.hats).toContain('shell:gold');
  });

  it('a Nubbin hatched straight into an adult (a story one) drops the shell unkept', () => {
    const world = createWorld(8, 0);
    const n = createEgg('nub-y', { x: 0, z: 0 }, new Rng(5), 'mint');
    hatch(n, []);
    n.stage = 'adult';
    advanceStage(n, 100, [], world);
    expect(n.hat).toBeNull();
    expect(world.inventory.hats).not.toContain('shell:mint');
  });

  it('a hatchling already wearing a hat keeps it, and other lines get no shell', () => {
    const a = { ...createEgg('a', { x: 0, z: 0 }, new Rng(4), 'rose'), hat: 'crown' };
    hatch(a, []);
    expect(a.hat).toBe('crown');
    const b = createEgg('b', { x: 0, z: 0 }, new Rng(4), 'rose', 'botamon');
    hatch(b, []);
    expect(b.hat).toBeNull();
  });
});

describe('the Quills and Shade looks', () => {
  it('a tier-3 win pays Quills to a Sun Keeper and Shade to a Moon Keeper', () => {
    expect(lookPrizesFor('sun')).toContain('look-quills');
    expect(lookPrizesFor('sun')).not.toContain('look-shade');
    expect(lookPrizesFor('moon')).toContain('look-shade');
    for (const id of ['look-quills', 'look-shade']) {
      expect(LOOK_PRIZES).toContain(id);
      expect(DRESS_HATS).toContain(id);
      expect(cosmeticLabel(id)).toMatch(/look$/);
    }
  });
});
