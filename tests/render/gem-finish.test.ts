/**
 * The 3D jewel, metal and shiny finishes (LOOK-29, LOOK-30): a jewel paints every role in its
 * gem palette, and the finish rides on the spec's `extras`, patching the body's shader under
 * its own program key.
 */
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { specForKey } from '../../src/render3d/looks';
import { paletteOf, NUBBIN_COLORS } from '../../src/samples/nubbin-variants';
import { gemFinishFor, JEWELS } from '../../src/samples/nubbin-variants-colour';
import { applyGemFinish } from '../../src/samples/gem-finish';
import { variantById } from '../../src/samples/nubbin-variant-catalogue';

describe('gem finish', () => {
  it('recolours tips, pads and wings on every jewel, in the catalogue and on a tinted key', () => {
    for (const j of JEWELS) {
      for (const spec of [
        specForKey(`nubbin~egg:${j.name}`),
        variantById(`jewel-${j.name}`)!.spec,
      ]) {
        const p = paletteOf(spec);
        for (const role of ['tip', 'pad', 'wing'] as const) {
          expect(p[role]).not.toBe(NUBBIN_COLORS[role]);
          expect([j.body, j.crownShade, j.belly, j.tip]).toContain(p[role]);
        }
        expect(spec.extras).toBeTypeOf('function');
      }
    }
  });

  it('picks jewel, metal and shiny by the rules', () => {
    const ruby = JEWELS.find((j) => j.name === 'ruby');
    const silver = JEWELS.find((j) => j.name === 'silver');
    expect(gemFinishFor(undefined, 'rose', false)).toBeNull();
    expect(gemFinishFor(undefined, 'rose', true)).toMatchObject({ shiny: true, jewel: false });
    expect(gemFinishFor(undefined, 'gold', false)).toMatchObject({ metal: true, jewel: false });
    expect(gemFinishFor(ruby, 'ruby', false)).toMatchObject({ jewel: true, metal: false });
    expect(gemFinishFor(silver, 'silver', true)).toMatchObject({ metal: true, shiny: true });
    // A plain egg keeps no extras of its own, so nothing is patched.
    expect(specForKey('nubbin~egg:rose').extras).toBeUndefined();
  });

  it('patches the body shader and keys its program apart', () => {
    const mat = new THREE.MeshPhysicalMaterial();
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1), mat);
    const before = mat.customProgramCacheKey();
    const tick = applyGemFinish(mat, [mesh], { jewel: true, shiny: true, rim: '#ffd0d8' });
    expect(mat.customProgramCacheKey()).toBe(`${before}|gem|js`);
    const shader = {
      uniforms: {} as Record<string, THREE.IUniform>,
      vertexShader: '',
      fragmentShader: '#include <common>\nvoid main() {\n#include <opaque_fragment>\n}',
    };
    mat.onBeforeCompile(shader as never, {} as never);
    expect(shader.fragmentShader).toContain('uniform float uGemTime;');
    expect(shader.fragmentShader).toContain('uGemRim');
    expect(shader.fragmentShader.match(/#include <opaque_fragment>/g)).toHaveLength(1);
    tick(2.5);
    expect(shader.uniforms.uGemTime!.value).toBe(2.5);
  });
});
