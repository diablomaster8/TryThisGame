import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { ShadowCache } from '../../src/render3d/shadow-cache';

/**
 * hot/perf-leaks round 2: the cached static layer of the sun's shadow map. The renderer is a
 * stand-in: its shadow map's `render` records which casters would be drawn (cast flag on), and
 * the GL calls the cache makes (renderbuffer, blits) are counted.
 */
function setup() {
  const blits: string[] = [];
  const draws: THREE.Object3D[][] = [];
  const gl = {
    FRAMEBUFFER: 1,
    READ_FRAMEBUFFER: 2,
    DRAW_FRAMEBUFFER: 3,
    RENDERBUFFER: 4,
    DEPTH_ATTACHMENT: 5,
    DEPTH_COMPONENT24: 6,
    DEPTH_BUFFER_BIT: 7,
    NEAREST: 8,
    FRAMEBUFFER_COMPLETE: 9,
    createRenderbuffer: () => ({}),
    createFramebuffer: () => ({ cache: true }),
    bindRenderbuffer: () => {},
    renderbufferStorage: () => {},
    framebufferRenderbuffer: () => {},
    checkFramebufferStatus: () => 9,
    bindFramebuffer: (t: number, fb: { cache?: boolean } | null) => {
      if (t === 2) blits.push(fb?.cache ? 'from-cache' : 'from-map');
    },
    blitFramebuffer: () => blits.push('blit'),
    deleteFramebuffer: () => {},
    deleteRenderbuffer: () => {},
  };
  const map = new THREE.WebGLRenderTarget(64, 64);
  map.depthTexture = new THREE.DepthTexture(64, 64, THREE.UnsignedIntType);
  map.depthTexture.format = THREE.DepthFormat;
  let target: THREE.WebGLRenderTarget | null = null;
  const scene = new THREE.Scene();
  const sun = new THREE.DirectionalLight();
  sun.castShadow = true;
  sun.shadow.map = map;
  scene.add(sun, sun.target);
  const renderer = {
    getContext: () => gl,
    properties: { get: () => ({ __webglFramebuffer: { map: true } }) },
    state: { buffers: { depth: { setMask: () => {} } }, bindFramebuffer: () => {} },
    getRenderTarget: () => target,
    setRenderTarget: (t: THREE.WebGLRenderTarget | null) => {
      target = t;
    },
    clear: () => blits.push('clear'),
    shadowMap: {
      enabled: true,
      autoUpdate: true,
      needsUpdate: false,
      type: THREE.BasicShadowMap,
      // Three's pass: clear the bound map, then draw every caster whose flag is on.
      render: (_l: THREE.Light[], s: THREE.Object3D, _c?: THREE.Camera) => {
        const prev = target;
        target = map;
        renderer.clear();
        const drawn: THREE.Object3D[] = [];
        s.traverseVisible((o) => {
          if (o.castShadow && (o as THREE.Mesh).isMesh) drawn.push(o);
        });
        draws.push(drawn);
        target = prev;
      },
    },
  };
  const creatures = new THREE.Group();
  scene.add(creatures);
  const cache = new ShadowCache(
    renderer as unknown as THREE.WebGLRenderer,
    () => [creatures],
    () => {},
  );
  const frame = () => {
    scene.updateMatrixWorld(true);
    renderer.shadowMap.render([sun], scene, new THREE.Camera());
  };
  return { cache, scene, creatures, sun, draws, blits, frame };
}

function caster(x: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
  m.position.set(x, 0, 0);
  m.castShadow = true;
  return m;
}

describe('ShadowCache (round 2)', () => {
  it('draws the still casters once, then only the movers over a copy of them', () => {
    const { cache, scene, creatures, draws, blits, frame } = setup();
    const wall = caster(0);
    const rock = caster(3);
    const pet = caster(6);
    scene.add(wall, rock);
    creatures.add(pet);
    for (let i = 0; i < 100; i++) frame();
    expect(cache.stats.rebuilt).toBeGreaterThan(0);
    // Once the still casters have held for the mover window, a frame draws only the creature.
    draws.length = 0;
    blits.length = 0;
    frame();
    expect(cache.stats.statics).toBe(2);
    expect(draws.at(-1)).toEqual([pet]);
    // ...over the cached depth (the clear became a blit from the cache).
    expect(blits).toContain('from-cache');
    expect(blits).not.toContain('clear');
    // Every flag is back as it was.
    expect([wall.castShadow, rock.castShadow, pet.castShadow]).toEqual([true, true, true]);
  });

  it('drops the cache when a still caster moves, and draws it every frame meanwhile', () => {
    const { cache, scene, draws, frame } = setup();
    const wall = caster(0);
    const rock = caster(3);
    scene.add(wall, rock);
    for (let i = 0; i < 100; i++) frame();
    const rebuilt = cache.stats.rebuilt;
    rock.position.x = 4;
    frame();
    expect(cache.stats.rebuilt).toBe(rebuilt + 1);
    // The rebuild's first pass draws the still one alone; the movers' pass adds the rock.
    expect(draws.at(-2)).toEqual([wall]);
    expect(draws.at(-1)).toEqual([rock]);
    frame();
    expect(draws.at(-1)).toEqual([rock]);
  });

  it('draws the plain way while the shadow camera moves', () => {
    const { cache, scene, sun, draws, frame } = setup();
    scene.add(caster(0), caster(3));
    for (let i = 0; i < 100; i++) frame();
    const plain = cache.stats.plain;
    for (let i = 0; i < 5; i++) {
      sun.position.x += 1;
      frame();
      expect(draws.at(-1)!.length).toBe(2);
    }
    expect(cache.stats.plain).toBe(plain + 5);
  });

  it('never caches a skinned mesh, which moves inside a still world matrix', () => {
    const { cache, scene, draws, frame } = setup();
    const bone = new THREE.Bone();
    const skin = new THREE.SkinnedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial(),
    );
    skin.add(bone);
    skin.bind(new THREE.Skeleton([bone]));
    skin.castShadow = true;
    scene.add(caster(0), skin);
    for (let i = 0; i < 100; i++) frame();
    expect(cache.stats.statics).toBe(1);
    expect(draws.at(-1)).toEqual([skin]);
  });
});
