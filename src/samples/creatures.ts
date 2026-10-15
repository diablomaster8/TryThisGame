import * as THREE from 'three';
import { fbm, ridged, vnoise } from '../render/paint/noise';
import { hex, Raster, type RGB } from '../render/paint/raster';
import { sculpt, V, type Prim } from './sculpted';

/**
 * Five creatures at a modern-console finish (`?aaa=1&creature=1..5`): each one a
 * sculpted single surface (see `sculpted.ts`) with its own silhouette, a surface
 * detail map projected triplanar (fur, scales, leaf veins, armour plates, a smooth
 * glow) that gives albedo and normal detail without UVs, colour regions, big glossy
 * eyes with irises and catchlights, and articulated pieces (ears, tails, wings, caps,
 * wisps) that idle-animate. The mood, light and post come from the AAA stage.
 */
export interface Creature {
  group: THREE.Group;
  name: string;
  animate(t: number): void;
}

// ---------------------------------------------------------------- surface detail

type Detail = 'fur' | 'scale' | 'leaf' | 'plate' | 'smooth';

interface DetailMaps {
  albedo: THREE.CanvasTexture;
  normal: THREE.DataTexture;
}

const detailCache = new Map<Detail, DetailMaps>();

function paintDetail(kind: Detail): DetailMaps {
  const cached = detailCache.get(kind);
  if (cached) return cached;
  const s = 256;
  const r = new Raster(s, s, hex('#808080'));
  const height = new Float32Array(s * s);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const ax = Math.cos((x / s) * Math.PI * 2) * 1.5;
      const ay = Math.sin((x / s) * Math.PI * 2) * 1.5;
      const bx = Math.cos((y / s) * Math.PI * 2) * 1.5;
      const by = Math.sin((y / s) * Math.PI * 2) * 1.5;
      const n = fbm(ax + bx + 3, ay + by + 3, 3, 81);
      let v: number;
      let h: number;
      switch (kind) {
        case 'fur': {
          // Fine strands running down, clumped by a slower field.
          const strand = Math.abs(vnoise(x / 2.2 + n * 6, y / 26, 82) - 0.5);
          const clump = fbm(x / 30, y / 18, 2, 83);
          v = 0.42 + (strand < 0.08 ? 0.22 : 0) + clump * 0.18;
          h = strand < 0.08 ? 0.8 : 0.35 + clump * 0.3;
          break;
        }
        case 'scale': {
          const cell = vnoise(x / 18 + (Math.floor(y / 18) % 2) * 0.5, y / 18, 84);
          const edge = Math.abs(cell - 0.5) < 0.05;
          v = 0.5 + (cell - 0.5) * 0.25 - (edge ? 0.2 : 0);
          h = edge ? 0.15 : 0.5 + (cell - 0.5) * 0.6;
          break;
        }
        case 'leaf': {
          const vein =
            Math.abs(vnoise(x / 40, y / 6, 85) - 0.5) < 0.02 || Math.abs((x % 64) - 32) < 1.5;
          v = 0.5 + n * 0.14 - (vein ? 0.16 : 0);
          h = vein ? 0.3 : 0.5 + n * 0.3;
          break;
        }
        case 'plate': {
          const px = x % 64;
          const py = y % 48;
          const seam = px < 3 || py < 3;
          const rivet = Math.hypot(px - 10, py - 10) < 4 || Math.hypot(px - 54, py - 38) < 4;
          const wear = ridged(x / 9, y / 9, 3, 86);
          v = 0.5 + (wear > 0.85 ? 0.18 : 0) - (seam ? 0.25 : 0) + (rivet ? 0.12 : 0);
          h = seam ? 0.1 : rivet ? 0.9 : 0.55 + fbm(x / 12, y / 12, 2, 87) * 0.2;
          break;
        }
        default:
          v = 0.5 + (n - 0.5) * 0.1;
          h = 0.5 + (n - 0.5) * 0.3;
      }
      const c: RGB = [v, v, v];
      r.set(x, y, c);
      height[y * s + x] = h;
    }
  }
  const albedo = r.toTexture(true);
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.magFilter = THREE.LinearFilter;
  albedo.minFilter = THREE.LinearMipmapLinearFilter;
  albedo.generateMipmaps = true;
  const data = new Uint8Array(s * s * 4);
  const strength = kind === 'plate' ? 5 : kind === 'scale' ? 4 : kind === 'fur' ? 2.5 : 2;
  const hh = (x: number, y: number) => height[((y + s) % s) * s + ((x + s) % s)]!;
  const nv = new THREE.Vector3();
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      nv.set(
        -(hh(x + 1, y) - hh(x - 1, y)) * strength,
        -(hh(x, y + 1) - hh(x, y - 1)) * strength,
        1,
      ).normalize();
      const i = (y * s + x) * 4;
      data[i] = Math.round((nv.x * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((nv.y * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((nv.z * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const normal = new THREE.DataTexture(data, s, s);
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  normal.magFilter = THREE.LinearFilter;
  normal.minFilter = THREE.LinearMipmapLinearFilter;
  normal.generateMipmaps = true;
  normal.needsUpdate = true;
  const maps = { albedo, normal };
  detailCache.set(kind, maps);
  return maps;
}

interface SurfaceOpts {
  detail: Detail;
  /** Repeats per unit. */
  scale?: number;
  /** How much the detail albedo modulates the colour, 0..1. */
  amount?: number;
  bump?: number;
  roughness?: number;
  sheen?: number;
  clearcoat?: number;
  glowColor?: string;
  glowStrength?: number;
}

/**
 * A physical material for a sculpted mesh: vertex colours for the regions, a detail
 * map projected along the three axes for albedo grain and bumps, sheen for fur and
 * cloth, clearcoat for shells, and emissive glow where the `glow` attribute is set.
 */
function surfaceMaterial(o: SurfaceOpts): THREE.MeshPhysicalMaterial {
  const maps = paintDetail(o.detail);
  const m = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: o.roughness ?? 0.6,
    metalness: 0,
    sheen: o.sheen ?? 0.3,
    sheenColor: new THREE.Color('#ffffff'),
    sheenRoughness: 0.7,
    clearcoat: o.clearcoat ?? 0.08,
    clearcoatRoughness: 0.35,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uDetail = { value: maps.albedo };
    shader.uniforms.uDetailN = { value: maps.normal };
    shader.uniforms.uScale = { value: o.scale ?? 1.6 };
    shader.uniforms.uAmount = { value: o.amount ?? 0.6 };
    shader.uniforms.uBump = { value: o.bump ?? 0.6 };
    shader.uniforms.uGlowStrength = { value: o.glowStrength ?? 0 };
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nattribute float glow;\nvarying vec3 vObjPos;\nvarying vec3 vObjNrm;\nvarying float vGlow;',
      )
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvObjPos = position;\nvObjNrm = normal;\nvGlow = glow;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform sampler2D uDetail;
         uniform sampler2D uDetailN;
         uniform float uScale;
         uniform float uAmount;
         uniform float uBump;
         uniform float uGlowStrength;
         uniform mat3 normalMatrix;
         varying vec3 vObjPos;
         varying vec3 vObjNrm;
         varying float vGlow;
         vec3 triW() { vec3 w = pow( abs( vObjNrm ), vec3( 4.0 ) ); return w / ( w.x + w.y + w.z + 1e-5 ); }`,
      )
      .replace(
        '#include <map_fragment>',
        `{
          vec3 w = triW();
          vec3 d = texture2D( uDetail, vObjPos.yz * uScale ).rgb * w.x
                 + texture2D( uDetail, vObjPos.xz * uScale ).rgb * w.y
                 + texture2D( uDetail, vObjPos.xy * uScale ).rgb * w.z;
          diffuseColor.rgb *= mix( vec3( 1.0 ), d * 2.0, uAmount );
        }`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `{
          vec3 w = triW();
          vec3 tx = texture2D( uDetailN, vObjPos.yz * uScale ).xyz * 2.0 - 1.0;
          vec3 ty = texture2D( uDetailN, vObjPos.xz * uScale ).xyz * 2.0 - 1.0;
          vec3 tz = texture2D( uDetailN, vObjPos.xy * uScale ).xyz * 2.0 - 1.0;
          vec3 bump = ( vec3( 0.0, tx.x, tx.y ) * w.x + vec3( ty.x, 0.0, ty.y ) * w.y + vec3( tz.x, tz.y, 0.0 ) * w.z ) * uBump;
          vec3 nO = normalize( normalize( vObjNrm ) + bump );
          normal = normalize( normalMatrix * nO );
          #ifdef DOUBLE_SIDED
            normal = normal * faceDirection;
          #endif
        }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor.rgb * vGlow * uGlowStrength;',
      );
  };
  return m;
}

// ---------------------------------------------------------------- parts

function glossy(
  color: string,
  extra: Partial<THREE.MeshPhysicalMaterialParameters> = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    ...extra,
  });
}

function add(parent: THREE.Object3D, m: THREE.Mesh, x: number, y: number, z: number): THREE.Mesh {
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/** A big cartoon eye: white, iris, pupil, two catchlights, and a lid of body colour. */
function eye(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  r: number,
  iris: string,
  lidColor: string,
  yaw: number,
  lid = 0.25,
): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = yaw;
  const white = add(
    g,
    new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), glossy('#ffffff', { roughness: 0.08 })),
    0,
    0,
    0,
  );
  white.scale.set(1, 1.25, 0.75);
  add(
    g,
    new THREE.Mesh(new THREE.SphereGeometry(r * 0.62, 24, 18), glossy(iris, { roughness: 0.12 })),
    0,
    -r * 0.05,
    r * 0.45,
  ).scale.set(1, 1.2, 0.5);
  add(
    g,
    new THREE.Mesh(new THREE.SphereGeometry(r * 0.3, 18, 14), glossy('#0d0d16')),
    0,
    -r * 0.05,
    r * 0.66,
  ).scale.set(1, 1.2, 0.5);
  add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(r * 0.17, 10, 8),
      new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    ),
    r * 0.22,
    r * 0.3,
    r * 0.78,
  );
  add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(r * 0.08, 8, 6),
      new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    ),
    -r * 0.2,
    -r * 0.3,
    r * 0.78,
  );
  // The upper lid: a cap of body colour that gives the eye its expression.
  const lidMesh = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(r * 1.06, 28, 14, 0, Math.PI * 2, 0, Math.PI * lid),
      new THREE.MeshPhysicalMaterial({ color: lidColor, roughness: 0.6, sheen: 0.3 }),
    ),
    0,
    0,
    0,
  );
  lidMesh.scale.set(1, 1.25, 0.78);
  parent.add(g);
  return g;
}

interface Part {
  mesh: THREE.Mesh;
  pivot: THREE.Group;
}

/** A sculpted sub-part hung from a pivot so it can sway. */
function part(
  parent: THREE.Object3D,
  prims: Prim[],
  blend: number,
  box: [THREE.Vector3, THREE.Vector3],
  mat: THREE.Material,
  pivotAt: THREE.Vector3,
  res = 72,
): Part {
  const geo = sculpt({ prims, blend, min: box[0], max: box[1] }, res);
  geo.translate(-pivotAt.x, -pivotAt.y, -pivotAt.z);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const pivot = new THREE.Group();
  pivot.position.copy(pivotAt);
  pivot.add(mesh);
  parent.add(pivot);
  return { mesh, pivot };
}

// ---------------------------------------------------------------- the five

/** 1. Nubbin: the Chao-faithful hero, velvet-smooth with wings and the emote ball. */
function nubbin(): Creature {
  const body = '#9ad0ff';
  const tip = '#ffd94a';
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'smooth',
    amount: 0.25,
    bump: 0.25,
    roughness: 0.5,
    sheen: 0.6,
  });
  const prims: Prim[] = [
    { kind: 'ellipsoid', a: V(0, 0.74, 0), radii: V(0.72, 0.7, 0.68), r: 0, color: body },
    { kind: 'ellipsoid', a: V(0, 1.92, 0), radii: V(0.74, 0.68, 0.7), r: 0, color: body },
    { kind: 'cone', a: V(0, 2.35, 0), b: V(0, 3.05, 0), r: 0.42, r2: 0.05, color: body },
    { kind: 'sphere', a: V(0, 3.06, 0), r: 0.1, color: tip },
    { kind: 'capsule', a: V(-0.62, 1.0, 0.1), b: V(-1.0, 0.76, 0.2), r: 0.15, color: body },
    { kind: 'capsule', a: V(0.62, 1.0, 0.1), b: V(1.0, 0.76, 0.2), r: 0.15, color: body },
    { kind: 'sphere', a: V(-1.03, 0.73, 0.22), r: 0.19, color: tip },
    { kind: 'sphere', a: V(1.03, 0.73, 0.22), r: 0.19, color: tip },
    { kind: 'ellipsoid', a: V(-0.36, 0.15, 0.24), radii: V(0.25, 0.15, 0.34), r: 0, color: tip },
    { kind: 'ellipsoid', a: V(0.36, 0.15, 0.24), radii: V(0.25, 0.15, 0.34), r: 0, color: tip },
  ];
  add(
    g,
    new THREE.Mesh(
      sculpt({ prims, blend: 0.22, min: V(-1.4, 0, -1.0), max: V(1.4, 3.3, 1.0) }),
      mat,
    ),
    0,
    0,
    0,
  );
  for (const dx of [-0.27, 0.27]) {
    eye(g, dx, 2.0, 0.56, 0.17, '#1c2b6e', body, dx * 0.6, 0.22);
    const cheek = add(
      g,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 12),
        new THREE.MeshPhysicalMaterial({
          color: '#ffb0c4',
          roughness: 0.9,
          transparent: true,
          opacity: 0.7,
        }),
      ),
      dx * 1.7,
      1.78,
      0.58,
    );
    cheek.scale.set(1, 0.6, 0.3);
  }
  const smile = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#5a3a4a' }),
    ),
    0,
    1.76,
    0.7,
  );
  smile.rotation.z = Math.PI;
  const wings: THREE.Group[] = [];
  for (const dx of [-1, 1]) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.42 * dx, 0.5, 0.14 * dx, 0.95);
    shape.quadraticCurveTo(-0.16 * dx, 0.55, 0, 0);
    const pivot = new THREE.Group();
    pivot.position.set(dx * 0.42, 1.15, -0.6);
    pivot.rotation.y = -dx * 0.5;
    pivot.add(
      new THREE.Mesh(
        new THREE.ShapeGeometry(shape, 18),
        new THREE.MeshPhysicalMaterial({
          color: '#f6faff',
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          roughness: 0.25,
          transmission: 0.25,
        }),
      ),
    );
    g.add(pivot);
    wings.push(pivot);
  }
  const ball = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 24, 18),
      glossy(tip, { emissive: new THREE.Color('#7a5a10'), emissiveIntensity: 1.2 }),
    ),
    0,
    3.5,
    0,
  );
  g.scale.setScalar(0.78);
  return {
    group: g,
    name: 'Nubbin',
    animate: (t) => {
      g.position.y += 0; // stays on the ground
      g.scale.y = 0.78 * (1 + Math.sin(t * 2.2) * 0.012);
      ball.position.y = 3.5 + Math.sin(t * 1.6) * 0.08;
      wings.forEach((w, i) => {
        w.rotation.y = -(i === 0 ? -1 : 1) * 0.5 + Math.sin(t * 9 + i) * 0.35 * (i === 0 ? -1 : 1);
      });
    },
  };
}

/** 2. Mossling: a round green sprout under a spotted mushroom cap, with a leaf collar. */
function mossling(): Creature {
  const body = '#79c56a';
  const belly = '#d9f0b4';
  const cap = '#e85a3a';
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'leaf',
    scale: 1.4,
    amount: 0.5,
    bump: 0.5,
    roughness: 0.55,
    sheen: 0.35,
  });
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.95, 0),
      radii: V(0.95, 0.9, 0.85),
      r: 0,
      color: body,
      tag: 'body',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.8, 0.45),
      radii: V(0.55, 0.55, 0.45),
      r: 0,
      color: belly,
      tag: 'belly',
    },
    { kind: 'capsule', a: V(-0.8, 1.1, 0.2), b: V(-1.25, 0.7, 0.45), r: 0.16, color: body },
    { kind: 'capsule', a: V(0.8, 1.1, 0.2), b: V(1.25, 0.7, 0.45), r: 0.16, color: body },
    { kind: 'ellipsoid', a: V(-0.4, 0.14, 0.3), radii: V(0.3, 0.14, 0.42), r: 0, color: '#4f8a46' },
    { kind: 'ellipsoid', a: V(0.4, 0.14, 0.3), radii: V(0.3, 0.14, 0.42), r: 0, color: '#4f8a46' },
    {
      kind: 'cone',
      a: V(0, 1.7, 0),
      b: V(0, 2.15, 0),
      r: 0.26,
      r2: 0.2,
      color: '#f3e6c8',
      tag: 'stem',
    },
  ];
  add(
    g,
    new THREE.Mesh(
      sculpt({ prims, blend: 0.18, min: V(-1.6, 0, -1.2), max: V(1.6, 2.4, 1.2) }),
      mat,
    ),
    0,
    0,
    0,
  );
  // The cap: a dome with white spots, hung from a pivot so it can tilt.
  const capMat = surfaceMaterial({
    detail: 'smooth',
    amount: 0.3,
    bump: 0.3,
    roughness: 0.4,
    clearcoat: 0.35,
    sheen: 0.1,
  });
  const capPart = part(
    g,
    [
      { kind: 'ellipsoid', a: V(0, 2.1, 0), radii: V(1.35, 0.62, 1.35), r: 0, color: cap },
      { kind: 'torus', a: V(0, 1.95, 0), r: 1.15, r2: 0.22, color: '#f3e6c8' },
    ],
    0.1,
    [V(-1.7, 1.5, -1.7), V(1.7, 2.9, 1.7)],
    capMat,
    V(0, 2.0, 0),
    80,
  );
  // Spots as vertex colour would blur; use small flattened discs instead.
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const rr = 0.45 + (i % 3) * 0.3;
    const spot = add(
      capPart.pivot,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.16 - (i % 3) * 0.03, 16, 12),
        new THREE.MeshPhysicalMaterial({ color: '#fff4e0', roughness: 0.5 }),
      ),
      Math.cos(a) * rr,
      0.62 - rr * rr * 0.28,
      Math.sin(a) * rr,
    );
    spot.scale.set(1, 0.35, 1);
  }
  // A collar of leaves.
  const leafMat = new THREE.MeshPhysicalMaterial({
    color: '#4fa040',
    roughness: 0.5,
    side: THREE.DoubleSide,
    sheen: 0.4,
  });
  const leaves: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.22, 0.35, 0, 0.75);
    shape.quadraticCurveTo(-0.22, 0.35, 0, 0);
    const leaf = add(
      g,
      new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), leafMat),
      Math.cos(a) * 0.72,
      1.62,
      Math.sin(a) * 0.72,
    );
    leaf.rotation.y = -a + Math.PI / 2;
    leaf.rotation.x = -0.9;
    leaves.push(leaf);
  }
  for (const dx of [-0.3, 0.3]) eye(g, dx, 1.15, 0.78, 0.2, '#2f6b2a', body, dx * 0.5, 0.2);
  const mouth = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.025, 8, 16, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#3a5a2a' }),
    ),
    0,
    0.84,
    0.95,
  );
  mouth.rotation.z = Math.PI;
  g.scale.setScalar(0.85);
  return {
    group: g,
    name: 'Mossling',
    animate: (t) => {
      capPart.pivot.rotation.z = Math.sin(t * 1.3) * 0.08;
      capPart.pivot.rotation.x = Math.cos(t * 1.1) * 0.06;
      g.scale.y = 0.85 * (1 + Math.sin(t * 2.4) * 0.015);
      leaves.forEach((l, i) => {
        l.rotation.x = -0.9 + Math.sin(t * 1.7 + i) * 0.08;
      });
    },
  };
}

/** 3. Fennel: a fox with a white bib, tall ears and a bushy swaying tail. */
function fennel(): Creature {
  const fur = '#f08a3c';
  const cream = '#fff1dc';
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'fur',
    scale: 2.2,
    amount: 0.55,
    bump: 0.7,
    roughness: 0.75,
    sheen: 1.0,
  });
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.95, -0.2),
      radii: V(0.62, 0.6, 0.95),
      r: 0,
      color: fur,
      tag: 'body',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.8, 0.25),
      radii: V(0.42, 0.45, 0.5),
      r: 0,
      color: cream,
      tag: 'bib',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.75, 0.55),
      radii: V(0.62, 0.55, 0.55),
      r: 0,
      color: fur,
      tag: 'head',
    },
    {
      kind: 'cone',
      a: V(0, 1.55, 0.9),
      b: V(0, 1.42, 1.3),
      r: 0.26,
      r2: 0.1,
      color: cream,
      tag: 'muzzle',
    },
    { kind: 'capsule', a: V(-0.4, 0.8, 0.45), b: V(-0.4, 0.2, 0.5), r: 0.14, color: fur },
    { kind: 'capsule', a: V(0.4, 0.8, 0.45), b: V(0.4, 0.2, 0.5), r: 0.14, color: fur },
    { kind: 'capsule', a: V(-0.38, 0.8, -0.8), b: V(-0.42, 0.2, -0.85), r: 0.15, color: fur },
    { kind: 'capsule', a: V(0.38, 0.8, -0.8), b: V(0.42, 0.2, -0.85), r: 0.15, color: fur },
    {
      kind: 'ellipsoid',
      a: V(-0.42, 0.12, 0.6),
      radii: V(0.18, 0.1, 0.26),
      r: 0,
      color: '#3a2a22',
    },
    { kind: 'ellipsoid', a: V(0.42, 0.12, 0.6), radii: V(0.18, 0.1, 0.26), r: 0, color: '#3a2a22' },
    {
      kind: 'ellipsoid',
      a: V(-0.44, 0.12, -0.78),
      radii: V(0.18, 0.1, 0.26),
      r: 0,
      color: '#3a2a22',
    },
    {
      kind: 'ellipsoid',
      a: V(0.44, 0.12, -0.78),
      radii: V(0.18, 0.1, 0.26),
      r: 0,
      color: '#3a2a22',
    },
  ];
  add(
    g,
    new THREE.Mesh(
      sculpt({
        prims,
        blend: 0.16,
        min: V(-1.3, 0, -1.6),
        max: V(1.3, 2.6, 1.6),
        colorAt: (p, n) => (n.tag === 'head' && p.y < 1.55 && p.z > 0.7 ? cream : n.color),
      }),
      mat,
    ),
    0,
    0,
    0,
  );
  // Ears: tall cones with pink insides, on pivots.
  const earMat = surfaceMaterial({
    detail: 'fur',
    scale: 2.2,
    amount: 0.5,
    bump: 0.6,
    roughness: 0.75,
    sheen: 1.0,
  });
  const ears: Part[] = [];
  for (const dx of [-0.34, 0.34]) {
    const e = part(
      g,
      [
        {
          kind: 'cone',
          a: V(dx, 2.1, 0.45),
          b: V(dx * 1.35, 2.95, 0.3),
          r: 0.26,
          r2: 0.04,
          color: fur,
        },
        {
          kind: 'cone',
          a: V(dx, 2.2, 0.55),
          b: V(dx * 1.3, 2.8, 0.42),
          r: 0.13,
          r2: 0.02,
          color: '#ffb6c8',
        },
      ],
      0.05,
      [V(dx - 0.7, 1.9, -0.2), V(dx + 0.7, 3.2, 1.0)],
      earMat,
      V(dx, 2.1, 0.45),
      64,
    );
    ears.push(e);
  }
  // The tail: a bushy chain of spheres on a pivot at the rump.
  const tail = part(
    g,
    [
      { kind: 'sphere', a: V(0, 0.9, -1.1), r: 0.26, color: fur },
      { kind: 'sphere', a: V(0, 1.05, -1.5), r: 0.36, color: fur },
      { kind: 'sphere', a: V(0, 1.35, -1.85), r: 0.4, color: fur },
      { kind: 'sphere', a: V(0, 1.75, -2.0), r: 0.34, color: fur },
      { kind: 'sphere', a: V(0, 2.05, -2.0), r: 0.24, color: cream },
    ],
    0.25,
    [V(-0.8, 0.4, -2.6), V(0.8, 2.5, -0.6)],
    earMat,
    V(0, 0.9, -1.05),
    80,
  );
  for (const dx of [-0.26, 0.26]) eye(g, dx, 1.85, 1.0, 0.16, '#3a6a2a', fur, dx * 0.7, 0.3);
  add(
    g,
    new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), glossy('#1a1414')),
    0,
    1.46,
    1.36,
  ).scale.set(1.2, 0.8, 0.8);
  g.scale.setScalar(0.95);
  return {
    group: g,
    name: 'Fennel',
    animate: (t) => {
      tail.pivot.rotation.y = Math.sin(t * 2.6) * 0.45;
      tail.pivot.rotation.x = Math.sin(t * 1.3) * 0.12;
      ears.forEach((e, i) => {
        e.pivot.rotation.z = Math.sin(t * 3.1 + i * 2) * 0.1 * (i === 0 ? 1 : -1);
      });
      g.scale.y = 0.95 * (1 + Math.sin(t * 2.0) * 0.012);
    },
  };
}

/** 4. Bolder: a six-legged beetle in riveted plates with two horns and ember seams. */
function bolder(): Creature {
  const plate = '#5f6a7a';
  const under = '#3a3f4a';
  const ember = '#ff7a2a';
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'plate',
    scale: 1.1,
    amount: 0.65,
    bump: 0.9,
    roughness: 0.42,
    sheen: 0.05,
    clearcoat: 0.6,
    glowStrength: 3.5,
  });
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.9, -0.1),
      radii: V(1.2, 0.72, 1.35),
      r: 0,
      color: plate,
      tag: 'shell',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.75, 0.9),
      radii: V(0.7, 0.55, 0.6),
      r: 0,
      color: under,
      tag: 'head',
    },
    { kind: 'torus', a: V(0, 1.05, -0.1), r: 0.55, r2: 0.09, color: ember, glow: 1, tag: 'seam' },
    {
      kind: 'cone',
      a: V(-0.35, 1.1, 1.1),
      b: V(-0.9, 2.2, 0.9),
      r: 0.18,
      r2: 0.03,
      color: '#8a8f9a',
      tag: 'horn',
    },
    {
      kind: 'cone',
      a: V(0.35, 1.1, 1.1),
      b: V(0.9, 2.2, 0.9),
      r: 0.18,
      r2: 0.03,
      color: '#8a8f9a',
      tag: 'horn',
    },
  ];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const z = 0.6 - i * 0.7;
      prims.push({
        kind: 'capsule',
        a: V(side * 0.9, 0.6, z),
        b: V(side * 1.45, 0.15, z - 0.1),
        r: 0.15,
        color: under,
      });
      prims.push({ kind: 'sphere', a: V(side * 1.5, 0.12, z - 0.1), r: 0.17, color: '#2a2e36' });
    }
  }
  add(
    g,
    new THREE.Mesh(
      sculpt({
        prims,
        blend: 0.12,
        min: V(-1.9, 0, -1.8),
        max: V(1.9, 2.5, 1.8),
        colorAt: (p, n) => {
          // Ember light leaks in the plate seams along the back.
          if (n.tag === 'shell') {
            const seam = Math.abs(Math.sin(p.z * 5.2)) < 0.08 && p.y > 0.95;
            return seam ? ember : plate;
          }
          return n.color;
        },
      }),
      mat,
    ),
    0,
    0,
    0,
  );
  for (const dx of [-0.3, 0.3]) eye(g, dx, 0.95, 1.42, 0.14, '#ffb020', under, dx * 0.6, 0.35);
  const mandible = new THREE.MeshPhysicalMaterial({
    color: '#8a8f9a',
    roughness: 0.4,
    clearcoat: 0.5,
  });
  const jaws: THREE.Mesh[] = [];
  for (const dx of [-0.22, 0.22]) {
    const j = add(
      g,
      new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.4, 10), mandible),
      dx,
      0.55,
      1.5,
    );
    j.rotation.x = Math.PI / 2;
    j.rotation.z = -dx * 1.2;
    jaws.push(j);
  }
  g.scale.setScalar(0.95);
  return {
    group: g,
    name: 'Bolder',
    animate: (t) => {
      g.scale.y = 0.95 * (1 + Math.sin(t * 1.4) * 0.01);
      (mat as THREE.MeshPhysicalMaterial).emissiveIntensity = 1;
      jaws.forEach((j, i) => {
        j.rotation.z =
          -(i === 0 ? -0.22 : 0.22) * 1.2 + Math.sin(t * 2.2) * 0.1 * (i === 0 ? 1 : -1);
      });
    },
  };
}

/** 5. Wisp: a hovering spirit, violet smoke with a glowing core and trailing tendrils. */
function wisp(): Creature {
  const smoke = '#6b3fb0';
  const dark = '#2a1a4a';
  const core = '#c9f0ff';
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'smooth',
    amount: 0.3,
    bump: 0.35,
    roughness: 0.3,
    sheen: 0.2,
    clearcoat: 0.4,
    glowStrength: 2.6,
  });
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 1.7, 0),
      radii: V(0.8, 0.9, 0.78),
      r: 0,
      color: smoke,
      tag: 'body',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.75, 0.3),
      radii: V(0.45, 0.5, 0.4),
      r: 0,
      color: core,
      glow: 1,
      tag: 'core',
    },
    {
      kind: 'cone',
      a: V(0, 1.0, 0),
      b: V(0.3, 0.1, -0.2),
      r: 0.42,
      r2: 0.03,
      color: dark,
      tag: 'tail',
    },
    {
      kind: 'cone',
      a: V(-0.7, 1.6, 0.1),
      b: V(-1.5, 2.2, 0.3),
      r: 0.2,
      r2: 0.03,
      color: smoke,
      tag: 'arm',
    },
    {
      kind: 'cone',
      a: V(0.7, 1.6, 0.1),
      b: V(1.5, 2.2, 0.3),
      r: 0.2,
      r2: 0.03,
      color: smoke,
      tag: 'arm',
    },
    {
      kind: 'cone',
      a: V(-0.3, 2.5, -0.1),
      b: V(-0.6, 3.3, -0.2),
      r: 0.22,
      r2: 0.03,
      color: dark,
      tag: 'flame',
    },
    {
      kind: 'cone',
      a: V(0.3, 2.5, -0.1),
      b: V(0.7, 3.2, -0.1),
      r: 0.2,
      r2: 0.03,
      color: dark,
      tag: 'flame',
    },
    {
      kind: 'cone',
      a: V(0, 2.55, 0),
      b: V(0.1, 3.5, 0),
      r: 0.24,
      r2: 0.03,
      color: smoke,
      tag: 'flame',
    },
  ];
  add(
    g,
    new THREE.Mesh(
      sculpt({ prims, blend: 0.3, min: V(-1.9, -0.2, -1.4), max: V(1.9, 3.8, 1.4) }),
      mat,
    ),
    0,
    0,
    0,
  );
  for (const dx of [-0.26, 0.26]) eye(g, dx, 1.9, 0.78, 0.17, '#b9ff5a', smoke, dx * 0.5, 0.18);
  const grin = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.03, 8, 20, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#1a0f2e' }),
    ),
    0,
    1.58,
    0.84,
  );
  grin.rotation.z = Math.PI;
  // Drifting motes around the core.
  const motes = new THREE.Group();
  const moteMat = new THREE.MeshBasicMaterial({ color: '#d8f6ff' });
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.04 + (i % 3) * 0.015, 8, 6), moteMat);
    m.userData.phase = i;
    motes.add(m);
  }
  g.add(motes);
  const light = new THREE.PointLight('#9ad8ff', 5, 6, 1.5);
  light.position.set(0, 1.8, 0.4);
  g.add(light);
  g.scale.setScalar(0.85);
  return {
    group: g,
    name: 'Wisp',
    animate: (t) => {
      g.position.y = g.userData.baseY + 0.55 + Math.sin(t * 1.4) * 0.18;
      g.rotation.z = Math.sin(t * 0.9) * 0.06;
      motes.children.forEach((m, i) => {
        const a = t * 0.9 + i * 0.63;
        m.position.set(
          Math.cos(a) * (0.9 + (i % 3) * 0.2),
          1.6 + Math.sin(a * 1.7) * 0.5,
          Math.sin(a) * 0.9,
        );
      });
      light.intensity = 4 + Math.sin(t * 3) * 1;
    },
  };
}

export const CREATURES: Array<() => Creature> = [nubbin, mossling, fennel, bolder, wisp];

export function buildCreature(index: number): Creature {
  const make = CREATURES[Math.max(0, Math.min(CREATURES.length - 1, index))]!;
  const c = make();
  c.group.userData.baseY = 0;
  return c;
}
