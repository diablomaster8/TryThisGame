import * as THREE from 'three';
import { paintJob, type Kind, type PaintedBytes } from './surface-paint';
import { placeGrass, type GrassField, type GrassPlacement } from './grass-place';

export type Mood = 'noon' | 'golden' | 'rain';

/**
 * The pieces of the AAA sample (`aaa-styles.ts`) that the Full 3D Grove builds with:
 * painted PBR textures, the terrain material, instanced grass, trees, particles and the
 * post passes. They live apart from the sample stage so the 3D chunk loads without it;
 * the stage itself (`?aaa=`) is its own chunk.
 */

// ---------------------------------------------------------------- painted PBR textures

// The painters are pure (`surface-paint.ts`), so the 3D Grove can run them in workers.
export type { Kind } from './surface-paint';

export interface Surface {
  map: THREE.Texture;
  normal: THREE.DataTexture;
}

/** A canvas holding RGBA bytes, as `Raster.toCanvas` makes it. */
export function rgbaCanvas(size: number, rgba: Uint8Array): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  const image = ctx.createImageData(size, size);
  image.data.set(rgba);
  ctx.putImageData(image, 0, 0);
  return canvas;
}

/** A tiling albedo and its normal map, from painted bytes. */
export function surfaceFrom(b: PaintedBytes): Surface {
  const map = new THREE.CanvasTexture(rgbaCanvas(b.size, b.albedo));
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.magFilter = THREE.LinearFilter;
  map.minFilter = THREE.LinearMipmapLinearFilter;
  map.generateMipmaps = true;
  map.anisotropy = 8;
  const normal = new THREE.DataTexture(
    b.normal ?? new Uint8Array(b.size * b.size * 4),
    b.size,
    b.size,
  );
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  normal.magFilter = THREE.LinearFilter;
  normal.minFilter = THREE.LinearMipmapLinearFilter;
  normal.generateMipmaps = true;
  normal.needsUpdate = true;
  return { map, normal };
}

/** An alpha card (leaves, tufts), from painted bytes. */
export function cardFrom(b: PaintedBytes): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(rgbaCanvas(b.size, b.albedo));
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  return t;
}

export function surface(kind: Kind, size: number, strength: number): Surface {
  return surfaceFrom(paintJob({ kind, size, strength }));
}

/** A card of overlapping leaves with alpha, for the instanced canopies. */
export function leafCard(size: number): THREE.CanvasTexture {
  return cardFrom(paintJob({ kind: 'leaf', size }));
}

/** A tuft of grass blades with alpha. */
export function tuftCard(size: number): THREE.CanvasTexture {
  return cardFrom(paintJob({ kind: 'tuft', size }));
}
export interface Tex {
  grass: Surface;
  rock: Surface;
  dirt: Surface;
  bark: Surface;
  cobble: Surface;
  plaster: Surface;
  roof: Surface;
  wood: Surface;
  leaf: THREE.CanvasTexture;
  tuft: THREE.CanvasTexture;
}

/**
 * A painted look for the meadow layer of `terrainMaterial` (the Grove and its minigames;
 * the stage samples pass none). The grass is multiplied toward `lush`, and broad soft
 * patches (a few metres across, from the world position, so they never tile) drift toward
 * `dry` by up to `patches`, the way a hand-painted field has warmer and cooler strokes.
 */
export interface TerrainLook {
  lush: string;
  dry: string;
  patches: number;
}

const glslColor = (c: string): string => {
  const v = new THREE.Color(c);
  return `vec3( ${v.r.toFixed(4)}, ${v.g.toFixed(4)}, ${v.b.toFixed(4)} )`;
};

export function terrainMaterial(
  tex: Tex,
  wet: boolean,
  time: { value: number },
  look?: TerrainLook,
): THREE.MeshPhysicalMaterial {
  const m = new THREE.MeshPhysicalMaterial({
    map: tex.grass.map,
    normalMap: tex.grass.normal,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughness: wet ? 0.3 : 0.92,
    metalness: 0,
    clearcoat: wet ? 0.55 : 0,
    clearcoatRoughness: 0.25,
    color: wet ? '#9aa89a' : '#ffffff',
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uRock = { value: tex.rock.map };
    shader.uniforms.uRockN = { value: tex.rock.normal };
    shader.uniforms.uDirt = { value: tex.dirt.map };
    shader.uniforms.uDirtN = { value: tex.dirt.normal };
    shader.uniforms.uTime = time;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nattribute vec2 blend;\nvarying vec2 vBlend;\nvarying vec2 vGround;',
      )
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvBlend = blend;\nvGround = ( modelMatrix * vec4( transformed, 1.0 ) ).xz;',
      );
    // The painted meadow: lush and dry strokes from two slow interfering waves.
    const paint = look
      ? `{
          // A second, larger and turned sample blended in, so the repeat does not show as
          // stripes across the far meadow.
          vec2 turned = mat2( 0.8, -0.6, 0.6, 0.8 ) * vMapUv * 0.43 + 0.37;
          cGrass.rgb = mix( cGrass.rgb, texture2D( map, turned ).rgb, 0.5 );
          float a = sin( vGround.x * 0.11 + sin( vGround.y * 0.07 ) * 2.3 );
          float b = sin( vGround.y * 0.13 + sin( vGround.x * 0.05 ) * 1.9 );
          float dry = smoothstep( -0.2, 0.9, a * b + 0.25 * a ) * ${look.patches.toFixed(3)};
          cGrass.rgb *= mix( ${glslColor(look.lush)}, ${glslColor(look.dry)}, dry );
        }`
      : '';
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform sampler2D uRock;\nuniform sampler2D uRockN;\nuniform sampler2D uDirt;\nuniform sampler2D uDirtN;\nvarying vec2 vBlend;\nvarying vec2 vGround;',
      )
      .replace(
        '#include <map_fragment>',
        `vec4 cGrass = texture2D( map, vMapUv );
         ${paint}
         vec4 cDirt = texture2D( uDirt, vMapUv * 0.8 );
         vec4 cRock = texture2D( uRock, vMapUv * 0.45 );
         vec4 sampledDiffuseColor = mix( mix( cGrass, cDirt, vBlend.y ), cRock, vBlend.x );
         diffuseColor *= sampledDiffuseColor;`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `vec3 nGrass = texture2D( normalMap, vNormalMapUv ).xyz;
         vec3 nDirt = texture2D( uDirtN, vNormalMapUv * 0.8 ).xyz;
         vec3 nRock = texture2D( uRockN, vNormalMapUv * 0.45 ).xyz;
         vec3 mapN = mix( mix( nGrass, nDirt, vBlend.y ), nRock, vBlend.x ) * 2.0 - 1.0;
         mapN.xy *= normalScale * ( 1.0 + vBlend.x * 1.2 );
         normal = normalize( tbn * mapN );`,
      );
  };
  // The look changes the shader text, not the function's, so it needs a key of its own.
  m.customProgramCacheKey = () =>
    look ? `terrain|${look.lush}|${look.dry}|${look.patches}` : 'terrain';
  return m;
}

/** Creatures pushing the grass: x, z, radius per slot; radius 0 is an empty slot. */
export const PUSHERS = Array.from({ length: 6 }, () => new THREE.Vector4(0, 0, 0, 0));

export type { GrassField, GrassPlacement } from './grass-place';

/**
 * The grass: two crossed passes of instanced tufts. Given a field, the tufts are placed
 * now. Given only a count, the meshes start empty (nothing drawn, the colour attribute
 * already there so the program compiles as it will draw) and `pourGrass` fills them when
 * a worker's placement lands.
 */
export function buildGrass(
  scene: THREE.Object3D,
  tex: Tex,
  time: { value: number },
  field: GrassField | number,
  /**
   * Tufts shrink into the ground between these distances from the camera (the Grove: the
   * far meadow is the painted terrain, so the blades need not reach it). Off when left out.
   */
  fade?: { from: number; to: number },
): THREE.InstancedMesh[] {
  const count = typeof field === 'number' ? field : field.count;
  const built: THREE.InstancedMesh[] = [];
  const geo = new THREE.PlaneGeometry(0.7, 0.6);
  geo.translate(0, 0.3, 0);
  const mat = new THREE.MeshStandardMaterial({
    map: tex.tuft,
    alphaTest: 0.45,
    side: THREE.DoubleSide,
    roughness: 1,
  });
  const fadeFrom = { value: fade?.from ?? 1e6 };
  const fadeTo = { value: fade?.to ?? 2e6 };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.uniforms.uPush = { value: PUSHERS };
    shader.uniforms.uFadeFrom = fadeFrom;
    shader.uniforms.uFadeTo = fadeTo;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uTime;\nuniform float uFadeFrom;\nuniform float uFadeTo;\nuniform vec4 uPush[' +
          PUSHERS.length +
          '];',
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec3 ip = vec3( instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2] );
         float sway = sin( uTime * 1.6 + ip.x * 0.9 + ip.z * 0.7 ) * 0.09 * uv.y;
         transformed.x += sway;
         transformed.z += sway * 0.5;
         // Blades near a creature part away from it and flatten, more so toward the tip.
         for ( int i = 0; i < ${PUSHERS.length}; i++ ) {
           vec2 d = ip.xz - uPush[ i ].xy;
           float r = uPush[ i ].z;
           float l = length( d );
           if ( r > 0.0 && l < r ) {
             float k = ( 1.0 - l / r ) * uv.y;
             vec2 dir = l > 0.001 ? d / l : vec2( 1.0, 0.0 );
             // The push is a world-space offset; "transformed" is still in the blade's own
             // space, so bring it through the inverse rotation and undo the instance scale
             // (the matrix is a rotation times a scale, so M^T v is the scale times R^-1 v,
             // and the instance matrix applies the scale again on the way out).
             vec3 dl = ( vec3( dir.x, 0.0, dir.y ) * mat3( instanceMatrix ) ) /
               dot( instanceMatrix[ 0 ].xyz, instanceMatrix[ 0 ].xyz );
             transformed.xz += dl.xz * k * r * 0.8;
             transformed.y -= k * 0.4 * uv.y;
           }
         }
         // Far from the camera the tuft sinks into the painted meadow under it.
         transformed *= 1.0 - smoothstep( uFadeFrom, uFadeTo, distance( ip.xz, cameraPosition.xz ) );`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <map_fragment>',
        // Dark at the root, bright at the tip: the tufts sit in the ground instead of on it.
        `#include <map_fragment>
         diffuseColor.rgb *= mix( 0.5, 1.15, smoothstep( 0.0, 0.85, vMapUv.y ) );`,
      )
      .replace(
        '#include <normal_fragment_begin>',
        // Lit mostly as the ground under them, so a tuft never flips dark or white as its
        // card turns from the sun.
        `#include <normal_fragment_begin>
         normal = normalize( mix( normal, normalize( ( viewMatrix * vec4( 0.0, 1.0, 0.0, 0.0 ) ).xyz ), 0.75 ) );`,
      );
  };
  for (let pass = 0; pass < 2; pass++) {
    const inst = new THREE.InstancedMesh(geo, mat, count);
    inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    inst.receiveShadow = true;
    scene.add(inst);
    built.push(inst);
  }
  if (typeof field === 'number') for (const inst of built) inst.count = 0;
  else pourGrass(built, placeGrass(field));
  return built;
}

/** Fill the grass meshes from a placement (`placeGrass`, on the page or in a worker). */
export function pourGrass(meshes: THREE.InstancedMesh[], placement: GrassPlacement): void {
  meshes.forEach((inst, pass) => {
    const matrices = placement.matrices[pass];
    const colours = placement.colours[pass];
    if (!matrices || !colours || !inst.instanceColor) return;
    inst.instanceMatrix.array.set(matrices);
    inst.instanceMatrix.needsUpdate = true;
    inst.instanceColor.array.set(colours);
    inst.instanceColor.needsUpdate = true;
    inst.count = matrices.length / 16;
    // Bounds measured while the mesh was empty would cull every tuft.
    inst.boundingBox = null;
    inst.boundingSphere = null;
  });
}

export function pbr(
  map: Surface,
  opts: { color?: string; rough?: number; repeat?: number; scale?: number } = {},
): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    map: map.map,
    normalMap: map.normal,
    normalScale: new THREE.Vector2(opts.scale ?? 0.8, opts.scale ?? 0.8),
    roughness: opts.rough ?? 0.85,
    metalness: 0,
    color: opts.color ?? '#ffffff',
  });
  return m;
}

export function repeatUv(geo: THREE.BufferGeometry, ru: number, rv: number): THREE.BufferGeometry {
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ru, uv.getY(i) * rv);
  return geo;
}

export function shadowed(m: THREE.Mesh): THREE.Mesh {
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/**
 * A crown of leaf cards shaded as one rounded mass: each card takes the normal of the
 * crown's ellipsoid at its place (biased up, so the top catches the sun and the underside
 * falls into shade) instead of its own random facing, which lit the cards as noise. Given
 * the clock, the cards also sway, the outer ones most.
 */
function canopyShading(
  mat: THREE.MeshStandardMaterial,
  centre: THREE.Vector3,
  scale: number,
  time?: { value: number },
): void {
  const clock = time ?? { value: 0 };
  const uniforms = {
    uTime: clock,
    uCanopy: { value: centre },
    uCanopyScale: { value: scale },
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uTime;\nuniform vec3 uCanopy;\nuniform float uCanopyScale;\nvarying vec3 vCanopyN;',
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec3 cp = instanceMatrix[ 3 ].xyz;
         vec3 out3 = cp - uCanopy;
         float outer = clamp( length( out3 ) / ( 2.6 * uCanopyScale ), 0.0, 1.0 );
         float ph = uTime * 1.4 + cp.x * 0.6 + cp.y * 0.9 + cp.z * 0.4;
         transformed += vec3( sin( ph ), sin( ph * 1.7 ) * 0.5, cos( ph * 1.3 ) ) * 0.05 * ( 0.4 + outer );
         vCanopyN = normalize( normalMatrix * ( out3 + vec3( 0.0, 0.9 * uCanopyScale, 0.0 ) ) );`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCanopyN;')
      .replace(
        '#include <normal_fragment_begin>',
        `#include <normal_fragment_begin>
         normal = normalize( mix( normal, vCanopyN, 0.8 ) );`,
      );
  };
  mat.customProgramCacheKey = () => 'canopy';
}

export function buildTree(
  scene: THREE.Object3D,
  tex: Tex,
  x: number,
  z: number,
  scale: number,
  seedBase: number,
  ground: (x: number, z: number) => number,
  /** The scene clock: given, the leaf cards sway in the wind. */
  time?: { value: number },
): THREE.Object3D[] {
  const y0 = ground(x, z);
  const made: THREE.Object3D[] = [];
  const add = (o: THREE.Object3D) => {
    scene.add(o);
    made.push(o);
  };
  const trunk = shadowed(
    new THREE.Mesh(
      repeatUv(new THREE.CylinderGeometry(0.28 * scale, 0.5 * scale, 3.2 * scale, 14, 4), 2, 2),
      pbr(tex.bark, { scale: 1.2 }),
    ),
  );
  trunk.position.set(x, y0 + 1.5 * scale, z);
  add(trunk);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + seedBase;
    const br = shadowed(
      new THREE.Mesh(
        repeatUv(new THREE.CylinderGeometry(0.1 * scale, 0.18 * scale, 2.0 * scale, 8), 1, 1),
        pbr(tex.bark),
      ),
    );
    br.position.set(x + Math.cos(a) * 0.7 * scale, y0 + 3.4 * scale, z + Math.sin(a) * 0.7 * scale);
    br.rotation.set(Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7);
    add(br);
  }
  // The canopy: a cloud of leaf cards, each turned its own way.
  const count = 170;
  const geo = new THREE.PlaneGeometry(1.5 * scale, 1.5 * scale);
  const mat = new THREE.MeshStandardMaterial({
    map: tex.leaf,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
    roughness: 0.9,
  });
  const cy = y0 + 4.6 * scale;
  canopyShading(mat, new THREE.Vector3(x, cy, z), scale, time);
  const inst = new THREE.InstancedMesh(geo, mat, count);
  let seed = 101 + seedBase * 1000;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // Points within an ellipsoid, denser toward the shell.
    const u = rnd() * 2 - 1;
    const t = rnd() * Math.PI * 2;
    const rr = Math.pow(rnd(), 0.35);
    const rx = Math.sqrt(1 - u * u) * Math.cos(t) * rr;
    const rz = Math.sqrt(1 - u * u) * Math.sin(t) * rr;
    p.set(x + rx * 2.6 * scale, cy + u * 2.0 * scale, z + rz * 2.6 * scale);
    e.set(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI);
    q.setFromEuler(e);
    const sc = 0.75 + rnd() * 0.7;
    s.set(sc, sc, sc);
    m.compose(p, q, s);
    inst.setMatrixAt(i, m);
    // Lit tops lighter, shaded bottoms darker.
    col.setHSL(0.28 + rnd() * 0.05, 0.6, 0.32 + (u * 0.5 + 0.5) * 0.25 + rnd() * 0.08);
    inst.setColorAt(i, col);
  }
  inst.castShadow = true;
  inst.receiveShadow = true;
  inst.customDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map: tex.leaf,
    alphaTest: 0.5,
  });
  add(inst);
  // Fruit.
  for (let i = 0; i < 5; i++) {
    const a = rnd() * Math.PI * 2;
    const f = shadowed(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.22 * scale, 16, 12),
        new THREE.MeshPhysicalMaterial({ color: '#ff8a2a', roughness: 0.35, clearcoat: 0.6 }),
      ),
    );
    f.position.set(
      x + Math.cos(a) * 2.2 * scale,
      cy - 0.6 * scale + rnd() * 1.6 * scale,
      z + Math.sin(a) * 2.2 * scale,
    );
    add(f);
  }
  return made;
}

export function buildParticles(scene: THREE.Scene, mood: Mood): THREE.Points | null {
  if (mood === 'noon') return null;
  const count = mood === 'rain' ? 2500 : 220;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = Math.random() * (mood === 'rain' ? 14 : 3) + 0.3;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 40 + 6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: mood === 'rain' ? '#cfe0ea' : '#ffe08a',
    size: mood === 'rain' ? 0.06 : 0.16,
    transparent: true,
    opacity: mood === 'rain' ? 0.55 : 0.95,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
}

// ---------------------------------------------------------------- mounting

export const CLAMP = {
  uniforms: { tDiffuse: { value: null as THREE.Texture | null } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D( tDiffuse, vUv );
      gl_FragColor = vec4( min( c.rgb, vec3( 4.0 ) ), c.a );
    }
  `,
};

export const GRADE = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTint: { value: new THREE.Color('#ffffff') },
    uSaturation: { value: 1.1 },
    uVignette: { value: 0.35 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;
    uniform float uSaturation;
    uniform float uVignette;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D( tDiffuse, vUv );
      float l = dot( c.rgb, vec3( 0.299, 0.587, 0.114 ) );
      c.rgb = mix( vec3( l ), c.rgb, uSaturation ) * uTint;
      vec2 d = vUv - 0.5;
      c.rgb *= 1.0 - uVignette * dot( d, d ) * 2.2;
      gl_FragColor = c;
    }
  `,
};
