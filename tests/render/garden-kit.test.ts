import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import type { Tex } from '../../src/samples/aaa-kit';
import { decorModel, useBuildingKit } from '../../src/render3d/garden';
import { KIT_SHARED } from '../../src/render3d/kit-buildings';

const mats = (g: THREE.Object3D) => {
  const out: THREE.Material[] = [];
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) out.push(m.material as THREE.Material);
  });
  return out;
};

// Review 2026-10-24: the 3D decor stood flat-coloured beside the painted well and cottage.
describe('3D garden decor on the building kit', () => {
  it('builds wood and stone decor from the kit materials once the textures are in', () => {
    const surface = { map: new THREE.Texture(), normal: new THREE.Texture() };
    const tex = new Proxy({}, { get: () => surface }) as unknown as Tex;
    useBuildingKit(tex);
    for (const kind of ['bench', 'fence', 'statue', 'pathTile', 'rockPile'] as const) {
      const all = mats(decorModel(kind));
      expect(all.length).toBeGreaterThan(0);
      expect(all.every((m) => KIT_SHARED.has(m))).toBe(true);
    }
    // Paint and planting keep their own colours.
    expect(mats(decorModel('flowerbed')).some((m) => !KIT_SHARED.has(m))).toBe(true);
  });
});
