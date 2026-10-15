import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

/**
 * Sculpted characters: instead of a stack of primitives, each figure is one smooth
 * surface. A signed-distance field made of spheres, capsules and ellipsoids joined
 * with a smooth minimum is polygonised with marching cubes, so the head flows into
 * the neck, the arms into the shoulders and the crown into the head, the way a clay
 * maquette or a subdivided game model does. Colour regions are assigned per vertex
 * from the nearest primitive, so cloth, skin and tips stay crisp.
 */
export interface Prim {
  kind: 'sphere' | 'capsule' | 'ellipsoid' | 'cone' | 'torus';
  /** For a cone: the radius at `b` (the radius at `a` is `r`). For a torus: the tube radius. */
  r2?: number;
  /** Emissive strength written to the `glow` vertex attribute. */
  glow?: number;
  a: THREE.Vector3;
  b?: THREE.Vector3;
  r: number;
  radii?: THREE.Vector3;
  color: string;
  /** A region label, so a colour can depend on more than the nearest primitive. */
  tag?: string;
}

const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();
const nTmp = new THREE.Vector3();

export function sdf(p: THREE.Vector3, q: Prim): number {
  switch (q.kind) {
    case 'sphere':
      return p.distanceTo(q.a) - q.r;
    case 'cone': {
      // A round cone between a (radius r) and b (radius r2), after Inigo Quilez.
      const ba = tmp.copy(q.b!).sub(q.a);
      const l2 = ba.lengthSq();
      const rr = q.r - (q.r2 ?? 0);
      const a2 = l2 - rr * rr;
      const il2 = 1 / l2;
      const pa = tmp2.copy(p).sub(q.a);
      const y = pa.dot(ba);
      const z = y - l2;
      const px = pa.x * l2 - ba.x * y;
      const py = pa.y * l2 - ba.y * y;
      const pz = pa.z * l2 - ba.z * y;
      const x2 = px * px + py * py + pz * pz;
      const y2 = y * y * l2;
      const z2 = z * z * l2;
      const k = Math.sign(rr) * rr * rr * x2;
      if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - (q.r2 ?? 0);
      if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - q.r;
      return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - q.r;
    }
    case 'torus': {
      // A ring lying flat (around y) at a: major radius r, tube r2.
      const dx = p.x - q.a.x;
      const dz = p.z - q.a.z;
      const qx = Math.hypot(dx, dz) - q.r;
      const qy = p.y - q.a.y;
      return Math.hypot(qx, qy) - (q.r2 ?? 0.1);
    }
    case 'capsule': {
      const ab = tmp.copy(q.b!).sub(q.a);
      const ap = tmp2.copy(p).sub(q.a);
      const t = THREE.MathUtils.clamp(ap.dot(ab) / ab.lengthSq(), 0, 1);
      return ap.sub(ab.multiplyScalar(t)).length() - q.r;
    }
    default: {
      const rr = q.radii!;
      const d = tmp.copy(p).sub(q.a);
      const k0 = Math.hypot(d.x / rr.x, d.y / rr.y, d.z / rr.z);
      const k1 = Math.hypot(d.x / (rr.x * rr.x), d.y / (rr.y * rr.y), d.z / (rr.z * rr.z));
      return (k0 * (k0 - 1)) / Math.max(1e-6, k1);
    }
  }
}

export function smin(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

export interface Sculpt {
  prims: Prim[];
  /** Blend radius between parts, in units. */
  blend: number;
  /** Bounding box in units; the figure must sit inside. */
  min: THREE.Vector3;
  max: THREE.Vector3;
  /** Pick a colour for a surface point given the nearest primitive. */
  colorAt?: (p: THREE.Vector3, nearest: Prim) => string;
  /** Adjust a surface colour in place from position and normal: gradients, markings. */
  shade?: (p: THREE.Vector3, n: THREE.Vector3, c: THREE.Color, nearest: Prim) => void;
}

/** Polygonise a sculpt into one smooth, vertex-coloured mesh. */
export function sculpt(s: Sculpt, resolution = 112): THREE.BufferGeometry {
  const mc = new MarchingCubes(resolution, new THREE.MeshBasicMaterial(), false, false, 400000);
  const size = tmp.copy(s.max).sub(s.min);
  const extent = Math.max(size.x, size.y, size.z) * 1.08;
  const centre = new THREE.Vector3().addVectors(s.min, s.max).multiplyScalar(0.5);
  const n = resolution;
  const p = new THREE.Vector3();
  // The addon's surface sits where the field crosses `isolation`; inside is above it.
  const iso = mc.isolation;
  const field = mc.field as Float32Array;
  for (let z = 0; z < n; z++) {
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        p.set(
          ((x + 0.5) / n - 0.5) * extent + centre.x,
          ((y + 0.5) / n - 0.5) * extent + centre.y,
          ((z + 0.5) / n - 0.5) * extent + centre.z,
        );
        let d = 1e9;
        for (const q of s.prims) d = smin(d, sdf(p, q), s.blend);
        field[z * n * n + y * n + x] = iso + (-d / extent) * 900;
      }
    }
  }
  mc.update();
  const count = mc.count;
  const pos = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const glow = new Float32Array(count);
  const posArr = mc.positionArray as Float32Array;
  const nrmArr = mc.normalArray as Float32Array;
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // Marching-cubes space is a [-1, 1] cube centred on the figure's box.
    const vx = (posArr[i * 3]! / 2) * extent + centre.x;
    const vy = (posArr[i * 3 + 1]! / 2) * extent + centre.y;
    const vz = (posArr[i * 3 + 2]! / 2) * extent + centre.z;
    pos[i * 3] = vx;
    pos[i * 3 + 1] = vy;
    pos[i * 3 + 2] = vz;
    // The addon's normals are raw field gradients; unit length is what everything downstream expects.
    const nl = Math.hypot(nrmArr[i * 3]!, nrmArr[i * 3 + 1]!, nrmArr[i * 3 + 2]!) || 1;
    nrm[i * 3] = nrmArr[i * 3]! / nl;
    nrm[i * 3 + 1] = nrmArr[i * 3 + 1]! / nl;
    nrm[i * 3 + 2] = nrmArr[i * 3 + 2]! / nl;
    p.set(vx, vy, vz);
    let best = s.prims[0]!;
    let bestD = 1e9;
    for (const q of s.prims) {
      const d = sdf(p, q);
      if (d < bestD) {
        bestD = d;
        best = q;
      }
    }
    c.set(s.colorAt ? s.colorAt(p, best) : best.color);
    if (s.shade) {
      nTmp.set(nrm[i * 3]!, nrm[i * 3 + 1]!, nrm[i * 3 + 2]!);
      s.shade(p, nTmp, c, best);
    }
    glow[i] = best.glow ?? 0;
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  mc.geometry.dispose();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('glow', new THREE.BufferAttribute(glow, 1));
  return geo;
}

export const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function skinMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.55,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.4,
    sheen: 0.3,
    sheenColor: new THREE.Color('#ffffff'),
    sheenRoughness: 0.8,
  });
}

function glossy(
  color: string,
  extra: Partial<THREE.MeshPhysicalMaterialParameters> = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    ...extra,
  });
}

function add(g: THREE.Group, m: THREE.Mesh, x: number, y: number, z: number): THREE.Mesh {
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

/**
 * The Keeper, sculpted: a cartoon figure with a big head, a short body in a shirt and
 * overalls, stubby arms and legs, all one surface. The cap, eyes, mouth, straps and
 * buttons sit on top as their own pieces.
 */
export function sculptedKeeper(): THREE.Group {
  const skin = '#ffd2ad';
  const red = '#e23a3a';
  const blue = '#2d4fd6';
  const brown = '#5a3416';
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 2.55, 0),
      radii: V(0.64, 0.6, 0.6),
      r: 0,
      color: skin,
      tag: 'head',
    },
    { kind: 'sphere', a: V(0, 2.46, 0.6), r: 0.15, color: '#ffbf95', tag: 'nose' },
    { kind: 'sphere', a: V(-0.6, 2.5, -0.02), r: 0.11, color: skin, tag: 'ear' },
    { kind: 'sphere', a: V(0.6, 2.5, -0.02), r: 0.11, color: skin, tag: 'ear' },
    {
      kind: 'ellipsoid',
      a: V(0, 2.62, -0.34),
      radii: V(0.52, 0.42, 0.4),
      r: 0,
      color: brown,
      tag: 'hair',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.72, 0),
      radii: V(0.56, 0.42, 0.46),
      r: 0,
      color: red,
      tag: 'shirt',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.22, 0.03),
      radii: V(0.58, 0.5, 0.5),
      r: 0,
      color: blue,
      tag: 'overalls',
    },
    {
      kind: 'capsule',
      a: V(-0.5, 1.86, 0),
      b: V(-1.0, 1.3, 0.14),
      r: 0.15,
      color: red,
      tag: 'arm',
    },
    { kind: 'capsule', a: V(0.5, 1.86, 0), b: V(1.0, 1.3, 0.14), r: 0.15, color: red, tag: 'arm' },
    { kind: 'sphere', a: V(-1.04, 1.24, 0.16), r: 0.21, color: '#ffffff', tag: 'hand' },
    { kind: 'sphere', a: V(1.04, 1.24, 0.16), r: 0.21, color: '#ffffff', tag: 'hand' },
    {
      kind: 'capsule',
      a: V(-0.27, 0.95, 0),
      b: V(-0.27, 0.35, 0),
      r: 0.18,
      color: blue,
      tag: 'leg',
    },
    { kind: 'capsule', a: V(0.27, 0.95, 0), b: V(0.27, 0.35, 0), r: 0.18, color: blue, tag: 'leg' },
    {
      kind: 'ellipsoid',
      a: V(-0.29, 0.17, 0.1),
      radii: V(0.25, 0.17, 0.34),
      r: 0,
      color: '#6a3414',
      tag: 'shoe',
    },
    {
      kind: 'ellipsoid',
      a: V(0.29, 0.17, 0.1),
      radii: V(0.25, 0.17, 0.34),
      r: 0,
      color: '#6a3414',
      tag: 'shoe',
    },
  ];
  const geo = sculpt({
    prims,
    blend: 0.14,
    min: V(-1.4, 0, -1.0),
    max: V(1.4, 3.3, 1.0),
    colorAt: (p, nearest) => {
      // The hair stays behind the face; the overalls' bib rises over the belly.
      if (nearest.tag === 'hair' && p.z > 0.2) return skin;
      if (nearest.tag === 'shirt' && p.y < 1.5 && Math.abs(p.x) < 0.3 && p.z > 0) return blue;
      return nearest.color;
    },
  });
  const g = new THREE.Group();
  const body = add(g, new THREE.Mesh(geo, skinMaterial()), 0, 0, 0);
  void body;
  // The cap: a dome, a brim, a badge.
  const capMat = new THREE.MeshPhysicalMaterial({
    color: red,
    roughness: 0.5,
    sheen: 0.4,
    sheenColor: new THREE.Color('#ffffff'),
  });
  const dome = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(0.69, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.47),
      capMat,
    ),
    0,
    2.74,
    -0.02,
  );
  dome.scale.set(1, 0.9, 1);
  const brim = add(
    g,
    new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.06, 32), capMat),
    0,
    2.98,
    0.5,
  );
  brim.scale.set(1, 1, 0.7);
  brim.rotation.x = -0.18;
  add(
    g,
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.04, 24),
      new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.4 }),
    ),
    0,
    3.1,
    0.62,
  ).rotation.x = Math.PI / 2 - 0.35;
  // Eyes: whites, blue irises, pupils, catchlights; brows.
  for (const dx of [-0.21, 0.21]) {
    const white = add(
      g,
      new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 18), glossy('#ffffff', { roughness: 0.1 })),
      dx,
      2.64,
      0.55,
    );
    white.scale.set(0.8, 1.25, 0.6);
    add(
      g,
      new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 16), glossy('#2a5bd7')),
      dx + (dx > 0 ? -0.02 : 0.02),
      2.63,
      0.63,
    ).scale.set(0.9, 1.1, 0.5);
    add(
      g,
      new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), glossy('#101020')),
      dx + (dx > 0 ? -0.02 : 0.02),
      2.63,
      0.665,
    ).scale.set(0.9, 1.1, 0.5);
    add(
      g,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 10, 8),
        new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      ),
      dx + 0.025,
      2.68,
      0.69,
    );
    const brow = add(
      g,
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.03, 0.14, 4, 10),
        new THREE.MeshPhysicalMaterial({ color: brown, roughness: 0.7 }),
      ),
      dx,
      2.85,
      0.56,
    );
    brow.rotation.z = Math.PI / 2 + (dx > 0 ? -0.25 : 0.25);
  }
  const mouth = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.022, 10, 20, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#8a2a2a', roughness: 0.6 }),
    ),
    0,
    2.3,
    0.59,
  );
  mouth.rotation.z = Math.PI;
  mouth.rotation.x = -0.35;
  // Overall straps and buttons.
  for (const dx of [-0.2, 0.2]) {
    const strap = add(
      g,
      new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.55, 0.06),
        new THREE.MeshPhysicalMaterial({ color: blue, roughness: 0.8, sheen: 0.4 }),
      ),
      dx,
      1.8,
      0.48,
    );
    strap.rotation.x = 0.3;
    add(
      g,
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.03, 16),
        glossy('#ffd34a', { roughness: 0.3 }),
      ),
      dx,
      1.55,
      0.56,
    ).rotation.x = Math.PI / 2;
  }
  g.scale.setScalar(0.78);
  return g;
}

/**
 * A Nubbin, sculpted in the Chao silhouette: belly and head one surface with a soft
 * neck, the crown drawn up to a point, stubby arms and feet with yellow tips. Eyes,
 * cheeks, wings and the emote ball sit on top.
 */
export function sculptedNubbin(body: string): THREE.Group {
  const tip = '#ffd94a';
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.72, 0),
      radii: V(0.7, 0.68, 0.66),
      r: 0,
      color: body,
      tag: 'belly',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.9, 0),
      radii: V(0.72, 0.66, 0.68),
      r: 0,
      color: body,
      tag: 'head',
    },
    { kind: 'sphere', a: V(0, 2.5, 0), r: 0.34, color: body, tag: 'crown' },
    { kind: 'sphere', a: V(0, 2.84, 0), r: 0.2, color: body, tag: 'crown' },
    { kind: 'sphere', a: V(0, 3.08, 0), r: 0.1, color: tip, tag: 'tip' },
    {
      kind: 'capsule',
      a: V(-0.62, 1.0, 0.1),
      b: V(-1.0, 0.76, 0.2),
      r: 0.15,
      color: body,
      tag: 'arm',
    },
    {
      kind: 'capsule',
      a: V(0.62, 1.0, 0.1),
      b: V(1.0, 0.76, 0.2),
      r: 0.15,
      color: body,
      tag: 'arm',
    },
    { kind: 'sphere', a: V(-1.03, 0.73, 0.22), r: 0.19, color: tip, tag: 'hand' },
    { kind: 'sphere', a: V(1.03, 0.73, 0.22), r: 0.19, color: tip, tag: 'hand' },
    {
      kind: 'ellipsoid',
      a: V(-0.36, 0.15, 0.24),
      radii: V(0.25, 0.15, 0.34),
      r: 0,
      color: tip,
      tag: 'foot',
    },
    {
      kind: 'ellipsoid',
      a: V(0.36, 0.15, 0.24),
      radii: V(0.25, 0.15, 0.34),
      r: 0,
      color: tip,
      tag: 'foot',
    },
  ];
  const geo = sculpt({ prims, blend: 0.22, min: V(-1.4, 0, -1.0), max: V(1.4, 3.3, 1.0) });
  const g = new THREE.Group();
  add(g, new THREE.Mesh(geo, skinMaterial()), 0, 0, 0);
  for (const dx of [-0.26, 0.26]) {
    const eye = add(
      g,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 24, 18),
        glossy('#16203f', { roughness: 0.08 }),
      ),
      dx,
      2.0,
      0.58,
    );
    eye.scale.set(1, 1.6, 0.5);
    eye.rotation.y = dx * 0.4;
    add(
      g,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 10),
        new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      ),
      dx - 0.04,
      2.13,
      0.7,
    );
    const cheek = add(
      g,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 12),
        new THREE.MeshPhysicalMaterial({
          color: '#ffb0c4',
          roughness: 0.8,
          transparent: true,
          opacity: 0.75,
        }),
      ),
      dx * 1.6,
      1.8,
      0.58,
    );
    cheek.scale.set(1, 0.6, 0.35);
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.4, 0.55, 0.12, 0.9);
    wingShape.quadraticCurveTo(-0.18, 0.55, 0, 0);
    const wing = add(
      g,
      new THREE.Mesh(
        new THREE.ShapeGeometry(wingShape, 16),
        new THREE.MeshPhysicalMaterial({
          color: '#f4f8ff',
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          roughness: 0.3,
          transmission: 0.2,
        }),
      ),
      dx * 1.7,
      1.1,
      -0.6,
    );
    wing.rotation.y = -dx * 2.6;
    wing.scale.x = dx > 0 ? 1 : -1;
  }
  const smile = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#6a3a4a', roughness: 0.6 }),
    ),
    0,
    1.78,
    0.7,
  );
  smile.rotation.z = Math.PI;
  const ball = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 24, 18),
      glossy(tip, { emissive: new THREE.Color('#6a5010'), emissiveIntensity: 0.6 }),
    ),
    0,
    3.55,
    0,
  );
  void ball;
  g.scale.setScalar(0.72);
  return g;
}
