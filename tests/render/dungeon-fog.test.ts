import { MeshLambertMaterial, ShaderLib } from 'three';
import { describe, expect, it } from 'vitest';
import { HOLLOW } from '../../src/config/tuning';
import { FogField, patchFragment, patchVertex } from '../../src/render/paint/dungeon-fog';
import { exploredMask, floorOfRun } from '../../src/sim/dungeon';
import { fogBytes, sightRadius } from '../../src/sim/dungeon-sight';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** The fog of war's GPU side (R0153): the mask → texture fill and the shader patch. */

describe('FogField', () => {
  it('fills its texture from the explored mask and turns off above ground', () => {
    const world = createWorld(11, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const run = world.dungeon!;
    const f = floorOfRun(run);
    const fog = new FogField();
    fog.setFloor(f);
    const tex = fog.uniforms.uFogTex.value;
    expect(tex.image.width).toBe(f.cols);
    expect(tex.image.height).toBe(f.rows);
    expect(tex.unpackAlignment).toBe(1);
    fog.update(run, world.keeper.pos);
    expect(fog.uniforms.uFogOn.value).toBe(1);
    const want = fogBytes(
      exploredMask(run, f),
      f.cols,
      f.rows,
      f.stairsUp,
      sightRadius(),
      HOLLOW.fog,
    );
    expect(Array.from(tex.image.data as Uint8Array)).toEqual(Array.from(want));
    fog.update(null, world.keeper.pos);
    expect(fog.uniforms.uFogOn.value).toBe(0);
  });

  it('patches a material once, with its own program key', () => {
    const fog = new FogField();
    const m = new MeshLambertMaterial();
    const before = m.customProgramCacheKey();
    fog.patch(m);
    fog.patch(m);
    expect(m.customProgramCacheKey()).toBe(`${before}|grove-fog`);
  });

  it('injects into built-in and hand-written shaders', () => {
    const v = patchVertex(ShaderLib.lambert.vertexShader);
    const fr = patchFragment(ShaderLib.lambert.fragmentShader);
    expect(v).toContain('vGroveFogXZ = ( modelMatrix * groveFogP ).xz;');
    expect(fr).toMatch(/uFogOn \);\n#include <dithering_fragment>/);
    const sv = patchVertex('void main() {\n  gl_Position = vec4(position, 1.0);\n}');
    const sf = patchFragment('void main() {\n  gl_FragColor = vec4(1.0);\n}');
    expect(sv.trim().endsWith('.xz;\n}')).toBe(true);
    expect(sf).toMatch(/gl_FragColor = vec4\(1\.0\);\n {2}gl_FragColor\.rgb \*=/);
  });
});
