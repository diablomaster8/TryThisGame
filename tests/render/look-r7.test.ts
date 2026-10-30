import { describe, expect, it } from 'vitest';
import { Group, type Mesh } from 'three';
import { BELT_COLOURS, beltOf } from '../../src/render/belt';
import { SheetCache } from '../../src/render/sprites/sheets';
import { Dresser } from '../../src/render3d/dress';
import type { Rigged } from '../../src/samples/species';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { Nubbin } from '../../src/sim/types';

/** Lane E round 7: the Dojo belt (LOOK-69). */
const belted = (belts: number): Nubbin => {
  const n = createEgg('b', { x: 0, z: 0 }, Rng.fromSeed(7));
  n.stage = 'child';
  n.karateRecord = {
    beltHistory: Array.from({ length: belts }, (_, i) => ({ belt: i + 1, atMs: i })),
    step: 0,
  };
  return n;
};

const meshCount = (g: Group) => {
  let k = 0;
  g.traverse((o) => {
    if ((o as Mesh).isMesh) k++;
  });
  return k;
};

describe('LOOK-69 Dojo belt', () => {
  it('wears the latest belt won, none before one or on an egg', () => {
    expect(beltOf(belted(0))).toBe(0);
    expect(beltOf(belted(3))).toBe(3);
    expect(BELT_COLOURS).toHaveLength(5);
    const egg = belted(2);
    egg.stage = 'egg';
    expect(beltOf(egg)).toBe(0);
  });

  it('the Wardrobe switch takes it off and puts it back', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    Object.assign(n, { stage: 'child', karateRecord: belted(2).karateRecord });
    applyCommand(w, { kind: 'wearBelt', nubbinId: n.id, on: false }, []);
    expect(beltOf(n)).toBe(0);
    applyCommand(w, { kind: 'wearBelt', nubbinId: n.id, on: true }, []);
    expect(n.hideBelt).toBeUndefined();
    expect(beltOf(n)).toBe(2);
  });

  it('changes the Pixel sheet and dresses the 3D hips', () => {
    expect(SheetCache.nubbinKey(belted(1))).not.toBe(SheetCache.nubbinKey(belted(0)));
    const group = new Group();
    group.userData.lookKey = 'variant:child';
    const r = { group, bones: { head: new Group(), hips: new Group() } } as unknown as Rigged;
    const d = new Dresser();
    d.update(r, belted(4));
    expect(meshCount(r.bones.hips as Group)).toBe(4);
    d.update(r, belted(0));
    expect(meshCount(r.bones.hips as Group)).toBe(0);
    d.dispose();
  });
});

describe('LOOK-70 seasonal hats', () => {
  it('puts the season hat first in its season, and keeps it once owned', async () => {
    const { shopHat } = await import('../../src/sim/shop');
    const { seasonHat, SHOP_COSMETICS } = await import('../../src/config/cosmetics');
    const w = createWorld(1, 0);
    for (const s of ['spring', 'summer', 'autumn', 'winter'] as const) {
      w.season = s;
      const id = seasonHat(s);
      expect(id, s).toBeTruthy();
      expect(shopHat(w)).toBe(id);
      // Never in the everyday rotation, so it is only on sale in its season.
      expect(SHOP_COSMETICS).not.toContain(id);
    }
    w.inventory.hats.push(seasonHat('winter')!);
    expect(shopHat(w)).not.toBe(seasonHat('winter'));
    w.season = 'spring';
    expect(w.inventory.hats).toContain(seasonHat('winter'));
  });
});
