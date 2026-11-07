import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { WORLD_MERGE } from '../../src/config/tuning';
import { buildingMaterial } from '../../src/render3d/building-kit';
import { WorldMerge, mergeable } from '../../src/render3d/world-merge';

const NO_GROUP = null as unknown as THREE.GeometryGroup;

/**
 * A renderer stand-in with three's draw order: a shadow pass (a depth material for each
 * caster), then the main pass with each mesh's own material, every draw through
 * `renderBufferDirect`. A material is "compiled" on its first draw: its hooks run on three's
 * physical shader text and the uniforms land where `renderer.properties` keeps them.
 */
function fakeRenderer(): {
  renderer: THREE.WebGLRenderer;
  draws: { object: THREE.Object3D; material: THREE.Material }[];
} {
  const props = new WeakMap<object, { uniforms?: Record<string, THREE.IUniform> }>();
  const draws: { object: THREE.Object3D; material: THREE.Material }[] = [];
  const depth = new THREE.MeshDepthMaterial();
  const lib = THREE.ShaderLib.physical;
  const get = (m: object): { uniforms?: Record<string, THREE.IUniform> } => {
    let p = props.get(m);
    if (!p) props.set(m, (p = {}));
    return p;
  };
  const renderer = {
    properties: { get },
    render(this: THREE.WebGLRenderer, scene: THREE.Object3D, camera: THREE.Camera): void {
      draws.length = 0;
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const meshes: THREE.Mesh[] = [];
      scene.traverseVisible((o) => {
        if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
      });
      for (const o of meshes)
        if (o.castShadow)
          this.renderBufferDirect(camera, scene as THREE.Scene, o.geometry, depth, o, NO_GROUP);
      for (const o of meshes) {
        const mat = o.material as THREE.Material;
        if (!mat.visible) continue;
        const p = get(mat);
        if (!p.uniforms) {
          const shader = {
            uniforms: THREE.UniformsUtils.clone(lib.uniforms),
            vertexShader: lib.vertexShader,
            fragmentShader: lib.fragmentShader,
          } as unknown as THREE.WebGLProgramParametersWithUniforms;
          mat.onBeforeCompile(shader, this);
          p.uniforms = shader.uniforms;
        }
        this.renderBufferDirect(camera, scene as THREE.Scene, o.geometry, mat, o, NO_GROUP);
      }
    },
    renderBufferDirect(
      _c: THREE.Camera,
      _s: unknown,
      _g: unknown,
      material: THREE.Material,
      object: THREE.Object3D,
    ): void {
      draws.push({ object, material });
    },
  } as unknown as THREE.WebGLRenderer;
  return { renderer, draws };
}

const surface = (): { map: THREE.Texture; normal: THREE.DataTexture } => ({
  map: new THREE.Texture(),
  normal: new THREE.DataTexture(new Uint8Array(4), 1, 1),
});

function world(): {
  scene: THREE.Scene;
  root: THREE.Group;
  camera: THREE.PerspectiveCamera;
  pieces: THREE.Mesh[];
} {
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  scene.add(root);
  const wood = surface();
  const stone = surface();
  const mats = [
    buildingMaterial(wood, { color: '#7a5434', normal: 0.5 }),
    buildingMaterial(stone, { color: '#d8d2c8', normal: 0.3 }),
    buildingMaterial(wood, { color: '#9a6236', normal: 0.4 }),
  ];
  const pieces = mats.map((m, i) => {
    // Three draws a box per face group; the Grove's merged buckets have none.
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.clearGroups();
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(i * 2 - 2, 0, 0);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.pick = { kind: 'building', id: `b${i}` };
    root.add(mesh);
    return mesh;
  });
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 0, 0);
  // As in the game, where the merge's sweep sees last frame's matrices.
  scene.updateMatrixWorld(true);
  return { scene, root, camera, pieces };
}

/** Renders a frame each sweep until the merge has seen, joined and built. */
function settle(r: THREE.WebGLRenderer, w: ReturnType<typeof world>, clock: { t: number }): void {
  for (let i = 0; i < 3; i++) {
    r.render(w.scene, w.camera);
    clock.t += Math.max(WORLD_MERGE.sweepMs, WORLD_MERGE.rebuildMs);
  }
  r.render(w.scene, w.camera);
}

const own = (draws: { object: THREE.Object3D; material: THREE.Material }[], o: THREE.Mesh) =>
  draws.filter((d) => d.object === o && d.material === o.material).length;
const merged = (root: THREE.Object3D): THREE.Mesh[] =>
  root.children.filter((c) => c.userData.worldMerge) as THREE.Mesh[];

describe('WorldMerge (hot/perf-leaks round 5)', () => {
  it('draws still pieces of one program in one call, each with its own colour and texture', () => {
    const w = world();
    const { renderer, draws } = fakeRenderer();
    const clock = { t: 0 };
    const wm = new WorldMerge(w.root, w.scene, renderer, undefined, () => clock.t);
    settle(renderer, w, clock);
    const [m] = merged(w.root);
    expect(merged(w.root)).toHaveLength(1);
    expect(wm.stats.pieces).toBe(3);
    // The pieces' own main-pass draws are skipped; the merged mesh draws once.
    for (const p of w.pieces) expect(own(draws, p)).toBe(0);
    expect(draws.filter((d) => d.object === m).length).toBe(1);
    // The shadow pass still draws every piece (with its depth material).
    for (const p of w.pieces)
      expect(draws.filter((d) => d.object === p && d.material !== p.material).length).toBe(1);
    // Two texture sets, sampled per piece; the merged mesh casts nothing and is never picked.
    const mat = m!.material as THREE.MeshStandardMaterial;
    expect(mat.customProgramCacheKey()).toMatch(/\|wmerge2$/);
    expect(m!.castShadow).toBe(false);
    const hits: THREE.Intersection[] = [];
    m!.raycast(new THREE.Raycaster(), hits);
    expect(hits).toHaveLength(0);
    // Each piece's colour, glow, normal strength and ground flag are in its column.
    const tex = (mat.userData.shader as THREE.WebGLProgramParametersWithUniforms).uniforms.wmData!
      .value as THREE.DataTexture;
    const data = tex.image.data as Float32Array;
    const n = w.pieces.length;
    w.pieces.forEach((p, i) => {
      const c = (p.material as THREE.MeshStandardMaterial).color;
      expect(Array.from(data.subarray(i * 4, i * 4 + 4))).toEqual(
        [c.r, c.g, c.b, 1].map(Math.fround),
      );
      const ns = (p.material as THREE.MeshStandardMaterial).normalScale.x;
      expect(data[(2 * n + i) * 4]).toBeCloseTo(ns, 6);
    });
    // The pieces keep their pick tags: taps still find the building.
    expect(w.pieces.map((p) => p.userData.pick.id)).toEqual(['b0', 'b1', 'b2']);
  });

  it('a piece that hides, moves or changes colour is right in the same frame', () => {
    const w = world();
    const { renderer, draws } = fakeRenderer();
    const clock = { t: 0 };
    const wm = new WorldMerge(w.root, w.scene, renderer, undefined, () => clock.t);
    settle(renderer, w, clock);
    const [a, b, c] = w.pieces as [THREE.Mesh, THREE.Mesh, THREE.Mesh];
    const data = () =>
      (
        (merged(w.root)[0]!.material as THREE.Material).userData
          .shader as THREE.WebGLProgramParametersWithUniforms
      ).uniforms.wmData!.value.image.data as Float32Array;
    // Hidden: masked in the merged mesh, and three does not draw it either.
    a.visible = false;
    renderer.render(w.scene, w.camera);
    expect(data()[3]).toBe(0);
    expect(own(draws, a)).toBe(0);
    a.visible = true;
    // Moved: it draws itself at once and the merged mesh drops it.
    b.position.x += 0.5;
    renderer.render(w.scene, w.camera);
    expect(own(draws, b)).toBe(1);
    expect(data()[4 + 3]).toBe(0);
    // A colour change is read per piece: still merged, new colour.
    (c.material as THREE.MeshStandardMaterial).color.set('#ff0000');
    renderer.render(w.scene, w.camera);
    expect(own(draws, c)).toBe(0);
    expect(data()[8]).toBe(1);
    // The kill switch: everything draws itself, the merged mesh hides.
    wm.enabled = false;
    renderer.render(w.scene, w.camera);
    expect(own(draws, a) + own(draws, c)).toBe(2);
    expect(draws.some((d) => d.object.userData.worldMerge)).toBe(false);
    wm.enabled = true;
    wm.dispose();
  });

  it('keeps apart materials whose hook uniforms are their own (a fading lantern post)', () => {
    const w = world();
    for (const p of w.pieces) {
      const mat = p.material as THREE.Material;
      const prev = mat.onBeforeCompile.bind(mat);
      const fade = { value: 1 };
      mat.onBeforeCompile = (s, r) => {
        prev(s, r);
        s.uniforms.uOwnFade = fade;
      };
    }
    const { renderer } = fakeRenderer();
    const clock = { t: 0 };
    new WorldMerge(w.root, w.scene, renderer, undefined, () => clock.t);
    settle(renderer, w, clock);
    expect(merged(w.root)).toHaveLength(0);
  });

  it('merges a fading post and a coloured prop with plain pieces, each reading its own', () => {
    const w = world();
    const [, post, prop] = w.pieces as [THREE.Mesh, THREE.Mesh, THREE.Mesh];
    // A lantern post's own fade (crowns.ts): an optional hook, neutral at fade 1.
    const pm = post.material as THREE.MeshStandardMaterial;
    const prev = pm.onBeforeCompile.bind(pm);
    const prevKey = pm.customProgramCacheKey();
    const fade = { value: 0.25 };
    const hole = { value: new THREE.Vector3() };
    pm.customProgramCacheKey = () => `${prevKey}|crown-dither`;
    pm.onBeforeCompile = (sh, r) => {
      prev(sh, r);
      sh.uniforms.uCrownFade = fade;
      sh.uniforms.uCrownWhole = { value: 0 };
      sh.uniforms.uCrownHole = hole;
      sh.fragmentShader = sh.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform float uCrownFade;\nuniform float uCrownWhole;',
        )
        .replace(
          '#include <alphatest_fragment>',
          '#include <alphatest_fragment>\nif (uCrownFade < 0.999 && uCrownWhole < 2.0) discard;',
        );
    };
    // A prop with vertex colours: the others read white.
    const geo = prop.geometry;
    const cols = new Float32Array(geo.getAttribute('position').count * 3).fill(0.5);
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    (prop.material as THREE.MeshStandardMaterial).vertexColors = true;
    const { renderer } = fakeRenderer();
    const clock = { t: 0 };
    new WorldMerge(w.root, w.scene, renderer, undefined, () => clock.t);
    settle(renderer, w, clock);
    const [m] = merged(w.root);
    expect(merged(w.root)).toHaveLength(1);
    const mat = m!.material as THREE.MeshStandardMaterial;
    expect(mat.vertexColors).toBe(true);
    const sh = mat.userData.shader as THREE.WebGLProgramParametersWithUniforms;
    // The fade is read per piece, not from the post's uniform.
    expect(sh.fragmentShader).not.toContain('uniform float uCrownFade;');
    expect(sh.fragmentShader).toContain('vWmF.x < 0.999');
    const data = sh.uniforms.wmData!.value.image.data as Float32Array;
    const n = w.pieces.length;
    expect([0, 1, 2].map((i) => data[(3 * n + i) * 4])).toEqual([1, 0.25, 1]);
    const c = m!.geometry.getAttribute('color');
    const per = w.pieces[0]!.geometry.getAttribute('position').count;
    expect([c.getX(0), c.getX(per), c.getX(2 * per)]).toEqual([1, 1, 0.5]);
  });

  it('leaves a program alone whose hooks rewrote what it needs, unless only colours differ', () => {
    const r = {} as THREE.WebGLRenderer;
    const sets: [THREE.Texture | null, THREE.Texture | null][] = [
      [new THREE.Texture(), new THREE.Texture()],
    ];
    expect(mergeable(buildingMaterial(surface()), sets, r)).toBe('all');
    const own = new THREE.MeshStandardMaterial();
    own.onBeforeCompile = (s) => {
      s.fragmentShader = s.fragmentShader.replace('#include <normal_fragment_maps>', '');
    };
    expect(mergeable(own, sets, r)).toBe('colours');
    expect(mergeable(own, [...sets, ...sets], r)).toBe(false);
    const paints = new THREE.MeshStandardMaterial();
    paints.onBeforeCompile = (s) => {
      s.fragmentShader = s.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        '',
      );
    };
    expect(mergeable(paints, sets, r)).toBe(false);
  });
});
