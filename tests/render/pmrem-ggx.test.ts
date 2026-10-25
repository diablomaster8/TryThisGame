import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { GGX_CALL, GGX_POLE, patchGgx, poleGgxSource } from '../../src/render3d/pmrem-ggx';

/** The pinned three's GGX filter material, made the way the sky's warm-up makes it. */
function ggxMaterial(): THREE.ShaderMaterial {
  const p = new THREE.PMREMGenerator({} as THREE.WebGLRenderer) as unknown as {
    _setSize(n: number): void;
    _allocateTargets(): THREE.WebGLRenderTarget;
    _ggxMaterial: THREE.ShaderMaterial;
  };
  p._setSize(256);
  p._allocateTargets();
  return p._ggxMaterial;
}

describe('PMREM GGX patch (ANGLE X4122)', () => {
  it('finds its anchor in the pinned three', () => {
    expect(ggxMaterial().fragmentShader).toContain(GGX_CALL);
  });

  it('swaps the pole sampler in once, before main', () => {
    const m = ggxMaterial();
    patchGgx(m);
    const src = m.fragmentShader;
    expect(src).not.toContain(GGX_CALL);
    expect(src).toContain(GGX_POLE);
    expect(src.indexOf('vec3 importanceSampleGGX_Pole')).toBeLessThan(src.indexOf('void main()'));
    patchGgx(m);
    expect(m.fragmentShader).toBe(src);
  });

  it('samples the same direction as the general sampler with V at the pole', () => {
    // The GLSL, in plain numbers: Heitz's VNDF sampler with V = (0, 0, 1) and the pole form.
    const general = (x: number, y: number, a: number) => {
      const r = Math.sqrt(x);
      const phi = 2 * Math.PI * y;
      const t1 = r * Math.cos(phi);
      const s = 0.5 * (1 + 1);
      const t2 = (1 - s) * Math.sqrt(1 - t1 * t1) + s * r * Math.sin(phi);
      const nz = Math.sqrt(Math.max(0, 1 - t1 * t1 - t2 * t2));
      return new THREE.Vector3(a * t1, a * t2, Math.max(0, nz)).normalize();
    };
    const pole = (x: number, y: number, a: number) => {
      const r = Math.sqrt(x);
      const phi = 2 * Math.PI * y;
      return new THREE.Vector3(
        a * r * Math.cos(phi),
        a * r * Math.sin(phi),
        Math.sqrt(Math.max(0, 1 - x)),
      ).normalize();
    };
    for (const [x, y, a] of [
      [0.1, 0.3, 0.2],
      [255 / 256, 0.25, 0.5],
      [0.5, 0.9, 1],
    ] as const)
      expect(pole(x, y, a).distanceTo(general(x, y, a))).toBeLessThan(1e-9);
  });

  it('leaves a source without the call alone', () => {
    expect(poleGgxSource('void main() {}')).toBe('void main() {}');
  });
});
