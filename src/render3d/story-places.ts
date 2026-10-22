import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CG_C } from '../config/tuning-c';
import { bevelBox } from './building-kit';

/**
 * The set pieces of the campaign's two story places in 3D (campaign graphics C8 and H5),
 * built for `story-sets.ts`: Corvin's garden gets a frost on the earth, a ring of frosted
 * trees and low hills so the fog meets land, his grey house with one lit window and a grey
 * gate; the Hollow gets a cold fire ring and a loose arc of bowls. Everything is instanced
 * or merged: the backdrop is two draws, the house four, the gate two, the camp three.
 */

const FROST = CG_C.corvin.frost;

/** A cheap deterministic sequence, so the backdrop is the same every time. */
function seq(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * White noise on the upward normals: patches of frost over the earth, so the ground reads
 * as frozen without a second texture. World-space, so the patches do not swim.
 */
export function frostify(m: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uFrost = { value: new THREE.Color(FROST.color) };
    shader.uniforms.uFrostScale = { value: FROST.scale };
    shader.uniforms.uFrostCover = { value: FROST.cover };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vFrostPos;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvFrostPos = (modelMatrix * vec4( transformed, 1.0 )).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 vFrostPos;
         uniform vec3 uFrost;
         uniform float uFrostScale;
         uniform float uFrostCover;
         float fHash( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
         float fNoise( vec2 p ) {
           vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
           return mix( mix( fHash( i ), fHash( i + vec2( 1, 0 ) ), f.x ),
                       mix( fHash( i + vec2( 0, 1 ) ), fHash( i + vec2( 1, 1 ) ), f.x ), f.y );
         }`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
         vec3 fWorldN = inverseTransformDirection( normal, viewMatrix );
         float fUp = smoothstep( 0.55, 0.9, fWorldN.y );
         float fN = fNoise( vFrostPos.xz * uFrostScale ) * 0.6 + fNoise( vFrostPos.xz * uFrostScale * 3.7 ) * 0.4;
         float fSparkle = step( 0.985, fHash( floor( vFrostPos.xz * 11.0 ) ) ) * step( 0.5, fN );
         float fAmt = smoothstep( uFrostCover - 0.14, uFrostCover + 0.12, fN ) * fUp;
         diffuseColor.rgb = mix( diffuseColor.rgb, uFrost, clamp( fAmt * 0.92 + fSparkle * fUp * 0.4, 0.0, 1.0 ) );`,
      );
  };
  m.customProgramCacheKey = () => 'cg-c-frost';
  return m;
}

/** A frosted spruce, merged and vertex-coloured: trunk, three tiers, a white cap. */
function spruceGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, hex: string): THREE.BufferGeometry => {
    const c = new THREE.Color(hex);
    const n = g.attributes.position!.count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  };
  const trunk = new THREE.CylinderGeometry(0.16, 0.24, 1.2, 6);
  trunk.translate(0, 0.6, 0);
  parts.push(paint(trunk, '#5b4a44'));
  const tiers: ReadonlyArray<readonly [number, number, number]> = [
    [1.25, 1.5, 1.0],
    [0.95, 1.4, 1.9],
    [0.62, 1.3, 2.7],
  ];
  for (const [r, h, y] of tiers) {
    const cone = new THREE.ConeGeometry(r, h, 7);
    cone.translate(0, y + h / 2 - 0.1, 0);
    parts.push(paint(cone, '#4c6876'));
    // The snow on that tier: a flatter, paler cone sitting just proud of it.
    const snow = new THREE.ConeGeometry(r * 0.82, h * 0.5, 7);
    snow.translate(0, y + h * 0.78 - 0.1, 0);
    parts.push(paint(snow, '#e8f0f8'));
  }
  const merged = mergeGeometries(parts.map((p) => p.toNonIndexed()))!;
  merged.computeVertexNormals();
  return merged;
}

/**
 * The ring of frosted trees and the low hills past it (C8): the plane's edge sits in the
 * fog, and from anywhere the Keeper can stand the horizon is land, not void.
 */
export function buildBackdrop(): THREE.Group {
  const b = CG_C.corvin.backdrop;
  const g = new THREE.Group();
  const rnd = seq(41);
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    flatShading: true,
  });
  const trees = new THREE.InstancedMesh(spruceGeometry(), mat, b.trees);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  let placed = 0;
  for (let i = 0; i < b.trees; i++) {
    const a = (i / b.trees) * Math.PI * 2 + (rnd() - 0.5) * 0.12;
    const r = b.rMin + rnd() * (b.rMax - b.rMin);
    const s = 0.8 + rnd() * 0.8;
    q.setFromAxisAngle(up, rnd() * 6.28);
    // Nothing grows on the road in, south of the gate, where the camera comes from.
    if (Math.sin(a) * r - 2 > 8 && Math.abs(Math.cos(a) * r) < 20) continue;
    trees.setMatrixAt(
      placed++,
      m4.compose(
        new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r - 2),
        q,
        new THREE.Vector3(s, s * (0.9 + rnd() * 0.4), s),
      ),
    );
  }
  trees.count = placed;
  trees.castShadow = trees.receiveShadow = true;
  trees.computeBoundingSphere();
  g.add(trees);

  // The hills: a ribbon of three rings, rising to a ridge of sums of sines and falling off.
  const segs = 96;
  const radii = [b.hillR - 4, b.hillR + 3, b.hillR + 14];
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const ridge = (a: number): number =>
    b.hillH *
    (0.55 + 0.25 * Math.sin(a * 3 + 1) + 0.15 * Math.sin(a * 7 + 2) + 0.1 * Math.sin(a * 13));
  const snow = new THREE.Color('#e4edf6');
  const slate = new THREE.Color('#6d8296');
  const dark = new THREE.Color('#4d6372');
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const h = ridge(a);
    const ys = [0, h, h * 0.35];
    radii.forEach((r, k) => {
      pos.push(Math.cos(a) * r, ys[k]!, Math.sin(a) * r - 2);
      const c = k === 1 ? snow : k === 0 ? dark : slate;
      col.push(c.r, c.g, c.b);
    });
    if (i < segs) {
      const o = i * 3;
      for (let k = 0; k < 2; k++)
        idx.push(o + k, o + k + 3, o + k + 1, o + k + 1, o + k + 3, o + k + 4);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const hills = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      side: THREE.DoubleSide,
      flatShading: true,
    }),
  );
  g.add(hills);
  return g;
}

export interface CorvinHouse {
  group: THREE.Group;
  /** The lit window's pane, for the glow and a borrowed lamp. */
  windowAt: THREE.Vector3;
  windowMaterial: THREE.MeshStandardMaterial;
}

/** A gable prism: `w` across, `rise` high at the ridge, `d` deep along z. */
function gable(w: number, rise: number, d: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(0, rise);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  geo.translate(0, 0, -d / 2);
  return geo;
}

/** Corvin's grey kit house: plaster, a slate roof under snow, one lit window (C8). */
export function buildCorvinHouse(): CorvinHouse {
  const h = CG_C.corvin.house;
  const g = new THREE.Group();
  g.position.set(h.x, 0, h.z);
  const wall = new THREE.MeshStandardMaterial({ color: '#9ca2b0', roughness: 0.9 });
  const slate = new THREE.MeshStandardMaterial({ color: '#566076', roughness: 0.8 });
  const snow = new THREE.MeshStandardMaterial({ color: '#eef4fb', roughness: 0.95 });
  const dark = new THREE.MeshStandardMaterial({ color: '#363a4b', roughness: 0.8 });
  const glass = new THREE.MeshStandardMaterial({
    color: '#ffe9b0',
    emissive: '#ffb347',
    emissiveIntensity: 1.5,
    roughness: 0.3,
  });
  const body = new THREE.Mesh(bevelBox(h.w, h.h, h.d, 0.06), wall);
  body.position.y = h.h / 2;
  const foot = new THREE.Mesh(bevelBox(h.w + 0.2, 0.3, h.d + 0.2, 0.04), dark);
  foot.position.y = 0.12;
  const rise = h.h * 0.55;
  const roof = new THREE.Mesh(gable(h.w + 0.9, rise, h.d + 0.7), slate);
  roof.position.y = h.h;
  // Snow lying on the slopes: the same prism, a hand smaller and a hand higher.
  const cap = new THREE.Mesh(gable(h.w + 0.6, rise * 0.93, h.d + 0.78), snow);
  cap.position.set(0, h.h + 0.18, 0);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.6, 0.1), dark);
  door.position.set(0, 0.8, h.d / 2 + 0.02);
  const pane = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.08), glass);
  pane.position.set(h.w * 0.28, h.h * 0.6, h.d / 2 + 0.03);
  const sill = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.18), dark);
  sill.position.set(h.w * 0.28, h.h * 0.6 - 0.45, h.d / 2 + 0.07);
  const step = new THREE.Mesh(bevelBox(1.5, 0.14, 0.7, 0.03), dark);
  step.position.set(0, 0.07, h.d / 2 + 0.4);
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.3, 0.6), dark);
  chimney.position.set(-h.w * 0.28, h.h + rise * 0.55, 0);
  for (const m of [body, roof, cap, chimney, foot]) m.castShadow = m.receiveShadow = true;
  g.add(body, foot, roof, cap, door, pane, sill, step, chimney);
  return {
    group: g,
    windowAt: new THREE.Vector3(h.x + h.w * 0.28, h.h * 0.6, h.z + h.d / 2 + 0.6),
    windowMaterial: glass,
  };
}

/** The garden's gate in a grey variant: two posts, a lintel with a cap, braced leaves (C8). */
export function buildGreyGate(): THREE.Group {
  const gt = CG_C.corvin.gate;
  const g = new THREE.Group();
  g.position.set(gt.x, 0, gt.z);
  const wood = new THREE.MeshStandardMaterial({ color: '#8d93a3', roughness: 0.9 });
  const cap = new THREE.MeshStandardMaterial({ color: '#eef4fb', roughness: 0.95 });
  const posts = new THREE.InstancedMesh(bevelBox(0.34, 2.3, 0.34, 0.05), wood, 2);
  const m4 = new THREE.Matrix4();
  posts.setMatrixAt(0, m4.makeTranslation(-gt.half, 1.15, 0));
  posts.setMatrixAt(1, m4.makeTranslation(gt.half, 1.15, 0));
  const lintel = new THREE.Mesh(bevelBox(gt.half * 2 + 0.9, 0.22, 0.34, 0.04), wood);
  lintel.position.y = 2.3;
  const snow = new THREE.Mesh(new THREE.BoxGeometry(gt.half * 2 + 0.7, 0.1, 0.4), cap);
  snow.position.y = 2.47;
  const hook = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.05), wood);
  hook.position.set(gt.half - 0.3, 2.05, 0.12);
  // Two leaves, each a frame with a diagonal brace, hinged at its post and swung half open
  // toward the road.
  const leaf = (side: number): THREE.Mesh => {
    const w = gt.half - 0.25;
    const dir = -side;
    const frame = [
      new THREE.BoxGeometry(w, 0.1, 0.08).translate((w / 2) * dir, 1.7, 0),
      new THREE.BoxGeometry(w, 0.1, 0.08).translate((w / 2) * dir, 0.45, 0),
      new THREE.BoxGeometry(0.1, 1.35, 0.08).translate(w * dir, 1.07, 0),
    ];
    const brace = new THREE.BoxGeometry(Math.hypot(w, 1.25), 0.08, 0.06);
    brace.rotateZ(Math.atan2(1.25, w) * dir);
    brace.translate((w / 2) * dir, 1.07, 0);
    const m = new THREE.Mesh(mergeGeometries([...frame, brace])!, wood);
    m.position.x = gt.half * side;
    m.rotation.y = -dir * 0.9;
    m.castShadow = true;
    return m;
  };
  g.add(posts, lintel, snow, hook, leaf(-1), leaf(1));
  for (const m of [posts, lintel]) m.castShadow = m.receiveShadow = true;
  return g;
}

/** The Hollow's camp: a ring of stones round grey ash, and a dozen bowls in a loose arc. */
export function buildHollowCamp(): THREE.Group {
  const f = CG_C.hollow.fire;
  const b = CG_C.hollow.bowls;
  const g = new THREE.Group();
  const rnd = seq(9);
  const stones = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: '#8d8f9b', roughness: 0.95, flatShading: true }),
    10,
  );
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    q.setFromAxisAngle(up, rnd() * 6);
    const s = 0.17 + rnd() * 0.07;
    stones.setMatrixAt(
      i,
      m4.compose(
        new THREE.Vector3(f.x + Math.cos(a) * f.r, 0.1, f.z + Math.sin(a) * f.r),
        q,
        new THREE.Vector3(s * 1.3, s, s * 1.1),
      ),
    );
  }
  stones.castShadow = stones.receiveShadow = true;
  const ash = new THREE.Mesh(
    new THREE.CircleGeometry(f.r * 0.82, 20),
    new THREE.MeshStandardMaterial({ color: '#4a4c57', roughness: 1 }),
  );
  ash.rotation.x = -Math.PI / 2;
  ash.position.set(f.x, 0.03, f.z);
  // A bowl: the lower half of a lathe, open to the sky.
  const profile = [
    new THREE.Vector2(0.001, 0),
    new THREE.Vector2(0.1, 0.01),
    new THREE.Vector2(0.17, 0.06),
    new THREE.Vector2(0.2, 0.12),
    new THREE.Vector2(0.18, 0.12),
    new THREE.Vector2(0.15, 0.07),
    new THREE.Vector2(0.001, 0.04),
  ];
  const bowls = new THREE.InstancedMesh(
    new THREE.LatheGeometry(profile, 10),
    new THREE.MeshStandardMaterial({
      color: '#8a7867',
      roughness: 0.8,
      side: THREE.DoubleSide,
    }),
    b.count,
  );
  for (let i = 0; i < b.count; i++) {
    const t = i / (b.count - 1);
    const a = ((b.from + (b.to - b.from) * t) * Math.PI) / 180;
    const r = b.r + (rnd() - 0.5) * 0.5;
    q.setFromAxisAngle(up, rnd() * 6);
    const s = 1.1 + rnd() * 0.5;
    bowls.setMatrixAt(
      i,
      m4.compose(
        new THREE.Vector3(f.x + Math.cos(a) * r, 0.01, f.z + Math.sin(a) * r),
        q,
        new THREE.Vector3(s, s, s),
      ),
    );
  }
  bowls.castShadow = bowls.receiveShadow = true;
  g.add(ash, stones, bowls);
  return g;
}
