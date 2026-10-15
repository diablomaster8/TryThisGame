import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { fbm, ridged, vnoise } from '../render/paint/noise';
import { hex, mix, Raster, shade, type RGB } from '../render/paint/raster';
import { sculptedKeeper, sculptedNubbin } from './sculpted';
import { buildCreature, type Creature } from './creatures';

/**
 * The HD-port direction taken to a AAA finish (`?aaa=1..3`): the same valley as the
 * console samples, but built the way a modern console game would build it.
 *
 *   - a physical sky (Preetham) lighting the scene through an environment map, with
 *     a sun that casts soft 4k shadows and fog that takes the sky's colour
 *   - a heightmap valley whose material blends grass, dirt and rock by slope and by
 *     the path, each with its own painted albedo and normal map
 *   - twelve thousand instanced grass tufts swaying in the wind, leaf-card trees with
 *     alpha-tested shadows, a normal-mapped cobbled mound, a plastered cottage
 *   - physical water with refraction and a scrolling normal map
 *   - the modelled Keeper and Nubbins in cloth (sheen) and clearcoat materials
 *   - screen-space ambient occlusion, bloom, depth of field, filmic tone mapping,
 *     grading with a vignette, and SMAA anti-aliasing
 *
 * Three moods: noon, golden hour (long shadows, fireflies, lit windows) and after
 * rain (overcast, wet clearcoat ground, drizzle, lit windows).
 */
export type Mood = 'noon' | 'golden' | 'rain';
export const MOODS: Mood[] = ['noon', 'golden', 'rain'];

// ---------------------------------------------------------------- painted PBR textures

type Kind = 'grass' | 'rock' | 'dirt' | 'bark' | 'cobble' | 'plaster' | 'roof' | 'wood';

interface Painted {
  albedo: Raster;
  height: Float32Array;
  size: number;
}

/** Albedo and a height field, painted on a torus so the tile wraps. */
function paint(kind: Kind, size: number): Painted {
  const r = new Raster(size, size, hex('#5f9e3c'));
  const height = new Float32Array(size * size);
  const s = size;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const ax = Math.cos((x / s) * Math.PI * 2) * 1.6;
      const ay = Math.sin((x / s) * Math.PI * 2) * 1.6;
      const bx = Math.cos((y / s) * Math.PI * 2) * 1.6;
      const by = Math.sin((y / s) * Math.PI * 2) * 1.6;
      const n = fbm(ax + bx + 5, ay + by + 5, 4, 51);
      const fine = fbm(x / (s / 24), y / (s / 24), 3, 52);
      const micro = fbm(x / (s / 64), y / (s / 64), 2, 53);
      let c: RGB;
      let h: number;
      switch (kind) {
        case 'grass': {
          // Blades: many fine, directional strokes over a mottled base.
          const blade = Math.abs(vnoise(x / (s / 90), y / (s / 14), 54) - 0.5) < 0.06;
          c = mix(hex('#3f8a2e'), hex('#8ed455'), Math.max(0, Math.min(1, (n - 0.3) * 1.8)));
          c = shade(c, 0.8 + fine * 0.4);
          if (blade) c = shade(c, 1.22);
          if (micro > 0.78) c = mix(c, hex('#d8e86a'), 0.3);
          h = 0.45 + (blade ? 0.3 : 0) + micro * 0.2;
          break;
        }
        case 'rock': {
          const strata = fbm(ax + 9, (y / s) * 8 + fbm(ax, 0, 2, 55) * 1.2, 3, 56);
          const g = ridged(x / (s / 10), y / (s / 10), 4, 57);
          c = mix(hex('#6a4a3a'), hex('#c8a080'), strata * 0.5 + g * 0.5);
          if (g > 0.86) c = shade(c, 0.45);
          if (micro > 0.8) c = mix(c, hex('#8a9a6a'), 0.35); // lichen
          h = g * 0.8 + strata * 0.2;
          break;
        }
        case 'dirt': {
          c = mix(hex('#6a4a2a'), hex('#b89262'), n * 0.6 + fine * 0.4);
          const pebble = vnoise(x / (s / 40), y / (s / 40), 58) > 0.8;
          if (pebble) c = mix(c, hex('#a8a8a0'), 0.6);
          h = 0.4 + fine * 0.3 + (pebble ? 0.3 : 0);
          break;
        }
        case 'bark': {
          const ridge = ridged(x / (s / 7), y / (s / 40), 3, 59);
          c = mix(hex('#3e2816'), hex('#8a6240'), ridge * 0.6 + n * 0.4);
          if (ridge > 0.85) c = shade(c, 0.5);
          h = ridge;
          break;
        }
        case 'cobble': {
          const cell = vnoise(x / (s / 9), y / (s / 9), 60);
          const cell2 = vnoise(x / (s / 9) + 3, y / (s / 9), 61);
          const joint = Math.abs(cell - 0.5) < 0.04 || Math.abs(cell2 - 0.5) < 0.035;
          c = mix(hex('#8a98a8'), hex('#e0e8ee'), n * 0.5 + fine * 0.5);
          if (joint) c = shade(c, 0.4);
          h = joint ? 0.1 : 0.6 + fine * 0.35;
          break;
        }
        case 'plaster':
          c = mix(hex('#e6dcc6'), hex('#fff8ea'), n);
          if (micro > 0.82) c = shade(c, 0.9);
          h = 0.5 + micro * 0.25;
          break;
        case 'roof': {
          const row = Math.floor(y / (s / 10));
          const tx = (x + (row % 2) * (s / 20)) % (s / 10);
          const ty = y % (s / 10);
          c = mix(hex('#8a3a2a'), hex('#d87a5a'), fine);
          const edge = tx < s / 120 || ty < s / 100;
          if (edge) c = shade(c, 0.45);
          h = edge ? 0.1 : 0.55 + (ty / (s / 10)) * 0.35;
          break;
        }
        default: {
          const plank = Math.floor(y / (s / 5));
          c = mix(
            hex('#7a4e26'),
            hex('#cfa066'),
            fbm(x / (s / 8), plank * 3, 3, 62) * 0.7 + fine * 0.3,
          );
          const seam = y % (s / 5) < 2;
          if (seam) c = shade(c, 0.45);
          h = seam ? 0.2 : 0.5 + fine * 0.3;
        }
      }
      r.set(x, y, c);
      height[y * s + x] = h;
    }
  }
  return { albedo: r, height, size };
}

/** A tangent-space normal map from a height field. */
function normalMap(p: Painted, strength: number): THREE.DataTexture {
  const s = p.size;
  const data = new Uint8Array(s * s * 4);
  const h = (x: number, y: number) => p.height[((y + s) % s) * s + ((x + s) % s)]!;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * strength;
      const dy = (h(x, y + 1) - h(x, y - 1)) * strength;
      const n = new THREE.Vector3(-dx, -dy, 1).normalize();
      const i = (y * s + x) * 4;
      data[i] = Math.round((n.x * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((n.y * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((n.z * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, s, s);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

interface Surface {
  map: THREE.Texture;
  normal: THREE.DataTexture;
}

function surface(kind: Kind, size: number, strength: number): Surface {
  const p = paint(kind, size);
  const map = p.albedo.toTexture(true);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.magFilter = THREE.LinearFilter;
  map.minFilter = THREE.LinearMipmapLinearFilter;
  map.generateMipmaps = true;
  map.anisotropy = 8;
  return { map, normal: normalMap(p, strength) };
}

/** A card of overlapping leaves with alpha, for the instanced canopies. */
function leafCard(size: number): THREE.CanvasTexture {
  const r = new Raster(size, size, null);
  r.tracking = true;
  const rng = { v: 7, next: () => (rng.v = (rng.v * 16807) % 2147483647) / 2147483647 };
  for (let i = 0; i < 14; i++) {
    const cx = size * (0.2 + rng.next() * 0.6);
    const cy = size * (0.2 + rng.next() * 0.6);
    const rx = size * (0.1 + rng.next() * 0.08);
    const ry = rx * (0.5 + rng.next() * 0.3);
    const tone = mix(hex('#2d7a2a'), hex('#8fd255'), rng.next());
    r.ellipse(cx, cy, rx, ry, tone);
    r.ellipse(cx - rx * 0.25, cy - ry * 0.3, rx * 0.55, ry * 0.45, shade(tone, 1.22));
    r.line(cx - rx * 0.8, cy, cx + rx * 0.8, cy, shade(tone, 0.7));
  }
  r.tracking = false;
  const t = r.toTexture(false);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  return t;
}

/** A tuft of grass blades with alpha. */
function tuftCard(size: number): THREE.CanvasTexture {
  const r = new Raster(size, size, null);
  r.tracking = true;
  for (let i = 0; i < 9; i++) {
    const x0 = size * (0.3 + (i / 9) * 0.4);
    const lean = (i - 4) * size * 0.06;
    const h = size * (0.55 + ((i * 7) % 5) * 0.08);
    const tone = mix(hex('#3f8a2e'), hex('#a8e060'), ((i * 5) % 9) / 9);
    for (let t = 0; t < 1; t += 0.02) {
      const x = x0 + lean * t * t;
      const y = size - t * h;
      r.disc(x, y, size * 0.03 * (1 - t) + 0.6, t > 0.7 ? shade(tone, 1.2) : tone);
    }
  }
  r.tracking = false;
  const t = r.toTexture(false);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  return t;
}

// ---------------------------------------------------------------- the valley

/** Height of the valley floor: a soft bowl rising into cliffs past the rim. */
function groundHeight(x: number, z: number): number {
  const d = Math.max(Math.abs(x) / 1.05, Math.abs(z - 6));
  const rim = THREE.MathUtils.smoothstep(d, 24, 40);
  const cliff = rim * rim * 17 * (0.75 + ridged(x / 7, z / 7, 3, 63) * 0.5);
  const roll = fbm(x / 9, z / 9, 3, 64) * 1.4 - 0.6 + fbm(x / 2.5, z / 2.5, 2, 65) * 0.18;
  return roll + cliff;
}

const PATH: Array<[number, number]> = [
  [2, -1],
  [6, 4],
  [11, 9],
  [14, 15],
  [18, 20],
];

function pathDistance(x: number, z: number): number {
  let best = 1e9;
  for (let i = 0; i + 1 < PATH.length; i++) {
    const [ax, az] = PATH[i]!;
    const [bx, bz] = PATH[i + 1]!;
    const dx = bx - ax;
    const dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    best = Math.min(best, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
  }
  return best;
}

interface Tex {
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

function terrainMaterial(
  tex: Tex,
  wet: boolean,
  time: { value: number },
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
        '#include <common>\nattribute vec2 blend;\nvarying vec2 vBlend;',
      )
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBlend = blend;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform sampler2D uRock;\nuniform sampler2D uRockN;\nuniform sampler2D uDirt;\nuniform sampler2D uDirtN;\nvarying vec2 vBlend;',
      )
      .replace(
        '#include <map_fragment>',
        `vec4 cGrass = texture2D( map, vMapUv );
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
  return m;
}

function buildTerrain(
  scene: THREE.Scene,
  tex: Tex,
  wet: boolean,
  time: { value: number },
): THREE.Mesh {
  const size = 96;
  const segs = 192;
  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const blend = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, groundHeight(x, z));
    uv.setXY(i, x / 3.2, z / 3.2);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const slope = 1 - nrm.getY(i);
    const rock =
      THREE.MathUtils.smoothstep(slope, 0.18, 0.45) + THREE.MathUtils.smoothstep(pos.getY(i), 4, 9);
    const dirt = 1 - THREE.MathUtils.smoothstep(pathDistance(x, z), 0.9, 1.9);
    blend[i * 2] = Math.min(1, rock);
    blend[i * 2 + 1] = dirt;
  }
  geo.setAttribute('blend', new THREE.BufferAttribute(blend, 2));
  const mesh = new THREE.Mesh(geo, terrainMaterial(tex, wet, time));
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  return mesh;
}

function buildGrass(scene: THREE.Scene, tex: Tex, time: { value: number }): void {
  const count = 12000;
  const geo = new THREE.PlaneGeometry(0.7, 0.6);
  geo.translate(0, 0.3, 0);
  const mat = new THREE.MeshStandardMaterial({
    map: tex.tuft,
    alphaTest: 0.45,
    side: THREE.DoubleSide,
    roughness: 1,
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec3 ip = vec3( instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2] );
         float sway = sin( uTime * 1.6 + ip.x * 0.9 + ip.z * 0.7 ) * 0.09 * uv.y;
         transformed.x += sway;
         transformed.z += sway * 0.5;`,
      );
  };
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let pass = 0; pass < 2; pass++) {
    const inst = new THREE.InstancedMesh(geo, mat, count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const col = new THREE.Color();
    let placed = 0;
    seed = 11 + pass * 977;
    while (placed < count) {
      const x = (rnd() - 0.5) * 70;
      const z = (rnd() - 0.5) * 70 + 6;
      const y = groundHeight(x, z);
      if (y > 2.2 || pathDistance(x, z) < 1.3 || Math.hypot(x + 1, z - 9) < 8.4) continue;
      if (Math.hypot(x, z) < 1.2) continue;
      p.set(x, y - 0.03, z);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * Math.PI + pass * (Math.PI / 2));
      const sc = 0.7 + rnd() * 0.8;
      s.set(sc, sc * (0.8 + rnd() * 0.5), sc);
      m.compose(p, q, s);
      inst.setMatrixAt(placed, m);
      col.setHSL(0.26 + rnd() * 0.06, 0.55 + rnd() * 0.3, 0.42 + rnd() * 0.18);
      inst.setColorAt(placed, col);
      placed++;
    }
    inst.receiveShadow = true;
    scene.add(inst);
  }
}

function pbr(
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

function repeatUv(geo: THREE.BufferGeometry, ru: number, rv: number): THREE.BufferGeometry {
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ru, uv.getY(i) * rv);
  return geo;
}

function shadowed(m: THREE.Mesh): THREE.Mesh {
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function buildTree(
  scene: THREE.Scene,
  tex: Tex,
  x: number,
  z: number,
  scale: number,
  seedBase: number,
): void {
  const y0 = groundHeight(x, z);
  const trunk = shadowed(
    new THREE.Mesh(
      repeatUv(new THREE.CylinderGeometry(0.28 * scale, 0.5 * scale, 3.2 * scale, 14, 4), 2, 2),
      pbr(tex.bark, { scale: 1.2 }),
    ),
  );
  trunk.position.set(x, y0 + 1.5 * scale, z);
  scene.add(trunk);
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
    scene.add(br);
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
  const inst = new THREE.InstancedMesh(geo, mat, count);
  let seed = 101 + seedBase * 1000;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const col = new THREE.Color();
  const cy = y0 + 4.6 * scale;
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
  scene.add(inst);
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
    scene.add(f);
  }
}

function buildProps(scene: THREE.Scene, tex: Tex, mood: Mood): void {
  // The cobbled mound, its vertices roughened a little.
  const mound = new THREE.CylinderGeometry(5.2, 7.8, 1.6, 8, 3);
  repeatUv(mound, 5, 1.2);
  const mp = mound.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < mp.count; i++) {
    const n = (fbm(mp.getX(i) / 2, mp.getZ(i) / 2, 2, 66) - 0.5) * 0.25;
    mp.setX(i, mp.getX(i) + n);
    mp.setZ(i, mp.getZ(i) + n);
  }
  mound.computeVertexNormals();
  const mm = shadowed(
    new THREE.Mesh(mound, pbr(tex.cobble, { scale: 1.4, rough: mood === 'rain' ? 0.35 : 0.75 })),
  );
  mm.position.set(-1, groundHeight(-1, 9) + 0.5, 9);
  mm.rotation.y = Math.PI / 8;
  scene.add(mm);
  const hole = new THREE.Mesh(
    new THREE.CircleGeometry(1.0, 24),
    new THREE.MeshBasicMaterial({ color: '#0a0a12' }),
  );
  hole.rotation.x = -Math.PI / 2;
  hole.position.set(-1.6, groundHeight(-1, 9) + 1.32, 8.4);
  scene.add(hole);
  // The ramp and the ledge.
  const ramp = shadowed(
    new THREE.Mesh(repeatUv(new THREE.BoxGeometry(5, 0.4, 14), 1.2, 4), pbr(tex.wood)),
  );
  ramp.position.set(21, 2.6, 20);
  ramp.rotation.x = -0.34;
  scene.add(ramp);
  const ledge = shadowed(
    new THREE.Mesh(
      repeatUv(new THREE.BoxGeometry(14, 5, 10), 3, 1.2),
      pbr(tex.rock, { scale: 1.3 }),
    ),
  );
  ledge.position.set(28, 2.5, 30);
  scene.add(ledge);
  // Signs and a crate.
  for (const [x, z] of [
    [9, 14],
    [17, 9],
  ] as const) {
    const y = groundHeight(x, z);
    const post = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.2, 0.16), pbr(tex.wood)));
    post.position.set(x, y + 0.6, z);
    const board = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.1), pbr(tex.wood)));
    board.position.set(x, y + 1.3, z);
    scene.add(post, board);
  }
  const crate = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), pbr(tex.wood)));
  crate.position.set(20, groundHeight(20, 7) + 0.6, 7);
  scene.add(crate);
  // The cottage: plaster walls, a tiled roof, a chimney, a door, windows that light up.
  const hy = groundHeight(-14, 20);
  const house = shadowed(
    new THREE.Mesh(
      repeatUv(new THREE.BoxGeometry(6, 3, 4.5), 2, 1),
      pbr(tex.plaster, { scale: 0.5 }),
    ),
  );
  house.position.set(-14, hy + 1.5, 20);
  scene.add(house);
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-3.6, 0);
  roofShape.lineTo(3.6, 0);
  roofShape.lineTo(0, 2.4);
  roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 5.3, bevelEnabled: false });
  const rp = roofGeo.attributes.position as THREE.BufferAttribute;
  const ruv = new Float32Array(rp.count * 2);
  for (let i = 0; i < rp.count; i++) {
    ruv[i * 2] = rp.getZ(i) / 1.8;
    ruv[i * 2 + 1] = rp.getX(i) / 1.8;
  }
  roofGeo.setAttribute('uv', new THREE.BufferAttribute(ruv, 2));
  roofGeo.computeVertexNormals();
  const roof = shadowed(new THREE.Mesh(roofGeo, pbr(tex.roof, { scale: 1.1 })));
  roof.position.set(-14, hy + 3, 17.35);
  scene.add(roof);
  const chimney = shadowed(
    new THREE.Mesh(repeatUv(new THREE.BoxGeometry(0.7, 1.6, 0.7), 1, 1), pbr(tex.cobble)),
  );
  chimney.position.set(-12, hy + 4.6, 19);
  scene.add(chimney);
  const door = shadowed(
    new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 0.12), pbr(tex.wood, { color: '#8a5a32' })),
  );
  door.position.set(-14, hy + 0.9, 22.3);
  scene.add(door);
  const lit = mood !== 'noon';
  for (const dx of [-1.9, 1.9]) {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.9, 0.1),
      new THREE.MeshPhysicalMaterial({
        color: lit ? '#ffd27a' : '#9ad0ff',
        emissive: lit ? '#ffb347' : '#000000',
        emissiveIntensity: lit ? 2.5 : 0,
        roughness: 0.1,
        clearcoat: 1,
      }),
    );
    win.position.set(-14 + dx, hy + 1.6, 22.3);
    scene.add(win);
    if (lit) {
      const glow = new THREE.PointLight('#ffb347', 6, 9, 1.6);
      glow.position.set(-14 + dx, hy + 1.6, 23.2);
      scene.add(glow);
    }
  }
}

function buildWater(scene: THREE.Scene, mood: Mood): THREE.Mesh {
  // A pond in the dip to the right of the mound.
  const p = paint('cobble', 128);
  const n = normalMap(p, 1.2);
  const mat = new THREE.MeshPhysicalMaterial({
    color: mood === 'rain' ? '#6a8a9a' : '#3f8fd0',
    roughness: 0.06,
    metalness: 0,
    transmission: 0.55,
    thickness: 1.2,
    ior: 1.33,
    normalMap: n,
    normalScale: new THREE.Vector2(0.18, 0.18),
    transparent: true,
    opacity: 0.95,
  });
  const geo = new THREE.CircleGeometry(4.6, 48);
  const water = new THREE.Mesh(geo, mat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(9, groundHeight(9, 1) + 0.12, 1);
  water.receiveShadow = true;
  scene.add(water);
  return water;
}

function buildParticles(scene: THREE.Scene, mood: Mood): THREE.Points | null {
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

const CLAMP = {
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

const GRADE = {
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

export function mountAaaSample(canvas: HTMLCanvasElement, mood: Mood): () => void {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure =
    mood === 'golden'
      ? 0.75
      : mood === 'rain'
        ? 0.8
        : location.search.includes('creature=')
          ? 0.55
          : 0.62;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const time = { value: 0 };

  // The sky and the light it gives everything.
  const sky = new Sky();
  sky.scale.setScalar(900);
  // The sun disc is thousands of times brighter than the ground; cap the sky so the
  // bloom pass does not smear it over the whole frame.
  scene.add(sky);
  const sun = new THREE.Vector3();
  const elevation = mood === 'golden' ? 7 : mood === 'rain' ? 34 : 52;
  const azimuth = mood === 'golden' ? 215 : 165;
  sun.setFromSphericalCoords(
    1,
    THREE.MathUtils.degToRad(90 - elevation),
    THREE.MathUtils.degToRad(azimuth),
  );
  const su = sky.material.uniforms;
  su.sunPosition!.value.copy(sun);
  su.turbidity!.value = mood === 'rain' ? 14 : mood === 'golden' ? 9 : 3.5;
  su.rayleigh!.value = mood === 'rain' ? 1.0 : mood === 'golden' ? 3.2 : 1.6;
  su.mieCoefficient!.value = mood === 'rain' ? 0.05 : mood === 'golden' ? 0.02 : 0.006;
  su.mieDirectionalG!.value = 0.85;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(sky.clone());
  scene.environment = pmrem.fromScene(envScene, 0.02).texture;
  scene.environmentIntensity = mood === 'rain' ? 0.4 : mood === 'golden' ? 0.7 : 0.7;
  pmrem.dispose();
  const fogColor = mood === 'rain' ? '#9aa6ad' : mood === 'golden' ? '#e8b58a' : '#c9dcf0';
  if (!new URLSearchParams(location.search).has('nofog'))
    scene.fog = new THREE.FogExp2(
      fogColor,
      mood === 'rain' ? 0.02 : mood === 'golden' ? 0.011 : 0.006,
    );

  const light = new THREE.DirectionalLight(
    mood === 'golden' ? '#ffb068' : mood === 'rain' ? '#d8e2ea' : '#fff6e4',
    mood === 'golden' ? 2.6 : mood === 'rain' ? 0.5 : 2.6,
  );
  light.position.copy(sun).multiplyScalar(60);
  light.castShadow = true;
  light.shadow.mapSize.set(4096, 4096);
  light.shadow.camera.left = -34;
  light.shadow.camera.right = 34;
  light.shadow.camera.top = 34;
  light.shadow.camera.bottom = -34;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 160;
  light.shadow.bias = -0.0006;
  light.shadow.normalBias = 0.03;
  light.shadow.radius = 3;
  scene.add(light);
  scene.add(new THREE.HemisphereLight('#cfe0ff', '#3a5a2a', mood === 'rain' ? 0.5 : 0.25));

  // Textures, then the world.
  const tex: Tex = {
    grass: surface('grass', 512, 2.2),
    rock: surface('rock', 512, 5),
    dirt: surface('dirt', 256, 2.5),
    bark: surface('bark', 256, 4),
    cobble: surface('cobble', 512, 5),
    plaster: surface('plaster', 256, 1.5),
    roof: surface('roof', 256, 4),
    wood: surface('wood', 256, 3),
    leaf: leafCard(256),
    tuft: tuftCard(128),
  };
  buildTerrain(scene, tex, mood === 'rain', time);
  buildGrass(scene, tex, time);
  for (const [x, z, s, seed] of [
    [-9, 13, 1.15, 1],
    [22, 7, 1.0, 2],
    [-24, 8, 1.25, 3],
    [8, 24, 1.1, 4],
    [-20, -4, 1.0, 5],
  ] as const)
    buildTree(scene, tex, x, z, s, seed);
  buildProps(scene, tex, mood);
  const water = buildWater(scene, mood);
  const particles = buildParticles(scene, mood);

  // The characters: sculpted as single surfaces, stood on the ground.
  const closeup = new URLSearchParams(location.search).has('closeup');
  const place = (g: THREE.Group, x: number, z: number, facing: number) => {
    g.position.set(x, groundHeight(x, z), z);
    g.rotation.y = facing;
    scene.add(g);
  };
  const creatureIndex = Number(new URLSearchParams(location.search).get('creature')) || 0;
  let creature: Creature | null = null;
  if (creatureIndex > 0) {
    // One creature on the stage, framed close, facing the camera.
    creature = buildCreature(creatureIndex - 1);
    creature.group.userData.baseY = groundHeight(0, 0);
    place(creature.group, 0, 0, Math.PI - 0.5);
    // A cool rim light from behind, as a character stage would have.
    const rim = new THREE.DirectionalLight('#bfe0ff', 1.8);
    rim.position.set(-4, 5, 8);
    scene.add(rim);
  } else {
    place(sculptedNubbin('#ff8ac0'), 4.2, 2.2, closeup ? Math.PI + 0.25 : 0.6);
    place(sculptedNubbin('#ff8ac0'), -3.5, 10.5, 0.1);
    place(sculptedNubbin('#9ad0ff'), -7, 4, -0.4);
    place(sculptedKeeper(), 0, 0, closeup ? Math.PI - 0.57 : 0);
  }

  const camera = new THREE.PerspectiveCamera(closeup || creature ? 36 : 46, 16 / 9, 0.1, 400);
  const q = new URLSearchParams(location.search);
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const ssao = new SSAOPass(scene, camera, 1, 1);
  ssao.kernelRadius = 10;
  ssao.minDistance = 0.0008;
  ssao.maxDistance = 0.08;
  if (!q.has('nossao')) composer.addPass(ssao);
  // The sun disc is thousands of times brighter than the ground: clamp the frame before
  // bloom so only lamps, catchlights and the sky's rim glow, not the whole picture.
  composer.addPass(new ShaderPass(CLAMP));
  // Bloom earns its place at golden hour (lamps, fireflies, the low sun); by day and in
  // the rain it only softens the picture, so those moods skip it.
  if (!q.has('nobloom') && mood === 'golden')
    composer.addPass(
      new UnrealBloomPass(new THREE.Vector2(1, 1), mood === 'golden' ? 0.35 : 0.12, 0.4, 2.8),
    );
  const bokeh = new BokehPass(scene, camera, {
    focus: closeup ? 5 : 10,
    aperture: closeup ? 0.00012 : 0.0001,
    maxblur: 0.007,
  });
  if (!q.has('nodof')) composer.addPass(bokeh);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GRADE);
  grade.uniforms.uTint!.value.set(
    mood === 'golden' ? '#ffe9d0' : mood === 'rain' ? '#dfe8f0' : '#ffffff',
  );
  grade.uniforms.uSaturation!.value = mood === 'rain' ? 0.92 : 1.2;
  composer.addPass(grade);
  const smaa = new SMAAPass();
  composer.addPass(smaa);

  const resize = () => {
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 450;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    ssao.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let raf = 0;
  const t0 = performance.now();
  const loop = () => {
    const t = (performance.now() - t0) / 1000;
    time.value = t;
    const a = Math.sin(t * 0.22) * 0.16;
    const ky = groundHeight(0, 0);
    if (creature) {
      creature.animate(t);
      const back = camera.aspect < 1.5 ? 1.25 : 1;
      camera.position.set((2.7 + Math.sin(a) * 0.6) * back, ky + 2.3 * back, -4.1 * back);
      camera.lookAt(0.05, ky + 1.2, 0.2);
    } else if (closeup) {
      camera.position.set(2.6 + Math.sin(a), ky + 2.1, -4.0);
      camera.lookAt(1.1, ky + 1.45, 0.6);
    } else {
      camera.position.set(Math.sin(a) * -7.5, ky + 3.3, Math.cos(a) * -7.5);
      camera.lookAt(Math.sin(a) * 2, ky + 1.6, 6);
    }
    const wm = water.material as THREE.MeshPhysicalMaterial;
    if (wm.normalMap) wm.normalMap.offset.set(t * 0.015, t * 0.02);
    if (particles) {
      const p = particles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        if (mood === 'rain') {
          let y = p.getY(i) - 0.35;
          if (y < 0) y += 14;
          p.setY(i, y);
        } else {
          p.setY(i, p.getY(i) + Math.sin(t * 1.3 + i) * 0.004);
          p.setX(i, p.getX(i) + Math.cos(t * 0.7 + i * 0.3) * 0.004);
        }
      }
      p.needsUpdate = true;
    }
    composer.render();
    raf = requestAnimationFrame(loop);
  };
  loop();
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    composer.dispose();
    renderer.dispose();
  };
}
