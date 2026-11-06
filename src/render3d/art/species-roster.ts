import * as THREE from 'three';
import { add, smokeShell, spots } from './creatures';
import { V, type Prim } from './sculpted';
import { namedRule } from './sculpt-rules';
import type { RigContext, SpeciesSpec } from './species';
import { FENNEL_SPEC, NUBBIN_SPEC } from './species-data';
import { digits } from './species-kit';

/**
 * The rest of the sample roster in the species description format: Mossling (a mushroom
 * with its cap for a head and the face on its body), Bolder (an eight-legged spider with
 * a row of extra eyes) and Wisp (a hovering smoke spirit). Together with the Nubbin and
 * Fennel from `species-data.ts` they make the five-creature sample.
 */

// ---------------------------------------------------------------- Mossling

const mossBody = '#6fbf62';
const mossBelly = '#e2f3c0';
const mossCap = '#e0502f';
const mossVine = '#3d8a3a';

/** The cap sits a little behind the body's centre so the face is never under its brim. */
const CAP_Z = -0.2;

function mosslingTorso(): Prim[] {
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.95, 0),
      radii: V(0.95, 0.9, 0.85),
      r: 0,
      color: mossBody,
      tag: 'body',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.8, 0.45),
      radii: V(0.55, 0.55, 0.45),
      r: 0,
      color: mossBelly,
      tag: 'belly',
    },
    {
      kind: 'cone',
      a: V(0, 1.7, 0),
      b: V(0, 2.15, 0),
      r: 0.28,
      r2: 0.22,
      color: '#f3e6c8',
      tag: 'stem',
    },
    { kind: 'sphere', a: V(-0.4, 1.6, -0.5), r: 0.22, color: '#4f9a3a', tag: 'moss' },
    { kind: 'sphere', a: V(0.45, 1.55, -0.55), r: 0.2, color: '#4f9a3a', tag: 'moss' },
    { kind: 'sphere', a: V(0.05, 1.3, -0.85), r: 0.24, color: '#4f9a3a', tag: 'moss' },
    // A vine winding round the body with little leaves.
    {
      kind: 'capsule',
      a: V(-0.9, 0.5, 0.2),
      b: V(-0.5, 1.1, -0.7),
      r: 0.05,
      color: mossVine,
      tag: 'vine',
    },
    {
      kind: 'capsule',
      a: V(-0.5, 1.1, -0.7),
      b: V(0.5, 1.45, -0.6),
      r: 0.05,
      color: mossVine,
      tag: 'vine',
    },
    {
      kind: 'capsule',
      a: V(0.5, 1.45, -0.6),
      b: V(0.95, 1.2, 0.1),
      r: 0.05,
      color: mossVine,
      tag: 'vine',
    },
    {
      kind: 'ellipsoid',
      a: V(-0.72, 0.85, -0.25),
      radii: V(0.14, 0.06, 0.22),
      r: 0,
      color: '#5fb050',
      tag: 'leaf',
    },
    {
      kind: 'ellipsoid',
      a: V(0.1, 1.5, -0.75),
      radii: V(0.2, 0.06, 0.13),
      r: 0,
      color: '#5fb050',
      tag: 'leaf',
    },
    {
      kind: 'ellipsoid',
      a: V(0.85, 1.3, -0.2),
      radii: V(0.12, 0.06, 0.2),
      r: 0,
      color: '#5fb050',
      tag: 'leaf',
    },
  ];
  // Root toes splayed on the ground.
  for (const dx of [-0.45, 0.45]) {
    prims.push(
      ...digits(V(dx, 0.15, 0.42), {
        count: 3,
        spread: 0.5,
        length: 0.5,
        r: 0.12,
        color: '#4a7a3a',
        dir: V(dx * 0.3, 0, 1),
        pad: { color: '#3a6a30', r: 0.2 },
        tag: 'root',
      }),
    );
  }
  return prims;
}

function mosslingArm(dx: number): SpeciesSpec['parts'][number] {
  return {
    name: dx < 0 ? 'armL' : 'armR',
    pivot: V(dx * 0.8, 1.1, 0.2),
    prims: [
      {
        kind: 'capsule',
        a: V(dx * 0.8, 1.1, 0.2),
        b: V(dx * 1.25, 0.7, 0.45),
        r: 0.16,
        color: mossBody,
        tag: 'arm',
      },
      { kind: 'sphere', a: V(dx * 1.27, 0.68, 0.48), r: 0.14, color: '#3f7a38', tag: 'hand' },
      ...digits(V(dx * 1.27, 0.66, 0.5), {
        count: 3,
        spread: 0.22,
        length: 0.24,
        r: 0.07,
        color: '#3f7a38',
        style: 'mitt',
        dir: V(dx * 0.35, -0.45, 0.8),
        tag: 'hand',
      }),
    ],
    box: [
      V(Math.min(dx * 0.8, dx * 1.5) - 0.3, 0.2, -0.2),
      V(Math.max(dx * 0.8, dx * 1.5) + 0.3, 1.5, 1.1),
    ],
    blend: 0.06,
    resolution: 48,
    surface: { detail: 'leaf', scale: 1.4, amount: 0.4, bump: 0.4, roughness: 0.55, sheen: 0.35 },
    noFur: true,
  };
}

/** Dew and gills on the cap, a ring of leaves at the collar, spores drifting up. */
function mosslingExtras({ hips, bones }: RigContext): (t: number) => void {
  const cap = bones.head!;
  const dewMat = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.02,
    transmission: 0.9,
    thickness: 0.2,
    ior: 1.33,
    transparent: true,
    opacity: 0.95,
  });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.7;
    const rr = 0.35 + (i % 3) * 0.3;
    const drop = add(
      cap,
      new THREE.Mesh(new THREE.SphereGeometry(0.06 + (i % 2) * 0.03, 14, 10), dewMat),
      Math.cos(a) * rr,
      0.6 - rr * rr * 0.28 + 0.12,
      Math.sin(a) * rr * 0.85 + CAP_Z,
    );
    drop.scale.set(1, 0.7, 1);
    drop.castShadow = false;
  }
  const gillMat = new THREE.MeshPhysicalMaterial({ color: '#f0d8b0', roughness: 0.7 });
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const gill = add(
      cap,
      new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.03), gillMat),
      Math.cos(a) * 0.8,
      0.02,
      Math.sin(a) * 0.7 + CAP_Z,
    );
    gill.rotation.y = -a;
  }
  const leafMat = new THREE.MeshPhysicalMaterial({
    color: '#4fa040',
    roughness: 0.5,
    side: THREE.DoubleSide,
    sheen: 0.4,
  });
  const leaves: THREE.Mesh[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.26, 0.4, 0, 0.9);
    shape.quadraticCurveTo(-0.26, 0.4, 0, 0);
    const leaf = add(
      hips,
      new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), leafMat),
      Math.cos(a) * 0.8,
      1.6 - MOSSLING_HIP,
      Math.sin(a) * 0.8,
    );
    leaf.rotation.y = -a + Math.PI / 2;
    leaf.rotation.x = -1.0;
    leaves.push(leaf);
  }
  const spores = new THREE.Group();
  const sporeMat = new THREE.MeshBasicMaterial({
    color: '#d8ffb0',
    transparent: true,
    opacity: 0.8,
  });
  for (let i = 0; i < 16; i++)
    spores.add(new THREE.Mesh(new THREE.SphereGeometry(0.025 + (i % 3) * 0.01, 6, 5), sporeMat));
  hips.add(spores);
  return (t) => {
    leaves.forEach((l, i) => {
      l.rotation.x = -1.0 + Math.sin(t * 1.7 + i) * 0.08;
    });
    spores.children.forEach((s, i) => {
      const life = (t * 0.25 + i * 0.37) % 1;
      const a = i * 1.7 + t * 0.3;
      s.position.set(
        Math.cos(a) * (0.6 + life * 0.8),
        1.7 - MOSSLING_HIP + life * 1.6,
        Math.sin(a) * (0.6 + life * 0.8),
      );
      s.scale.setScalar(1 - life * 0.7);
    });
  };
}

const MOSSLING_HIP = 0.95;

/**
 * One short jointed leg under the Mossling's round body: a mossy thigh and shin with a
 * knee ball, and a pale three-toed foot poking out in front. Added so it walks on planted
 * feet and folds its legs asleep instead of sliding on its belly.
 */
function mosslingLeg(side: -1 | 1): SpeciesSpec['parts'][number] {
  const x = side * 0.38;
  const hip = V(x, 0.55, 0.2);
  const knee = V(x, 0.3, 0.38);
  const ankle = V(x, 0.16, 0.46);
  return {
    name: side < 0 ? 'legL' : 'legR',
    pivot: V(x, 0.5, 0.25),
    prims: [
      { kind: 'capsule', a: hip, b: knee, r: 0.17, color: mossBody, tag: 'leg' },
      { kind: 'sphere', a: knee, r: 0.165, color: mossBody, tag: 'leg' },
    ],
    box: [V(x - 0.5, 0.05, -0.2), V(x + 0.5, 0.85, 0.7)],
    resolution: 40,
    joint: {
      name: side < 0 ? 'kneeL' : 'kneeR',
      pivot: knee,
      prims: [
        { kind: 'sphere', a: knee, r: 0.175, color: mossBody, tag: 'leg' },
        { kind: 'capsule', a: knee, b: ankle, r: 0.15, color: mossBody, tag: 'leg' },
        {
          kind: 'ellipsoid',
          a: V(x, 0.13, 0.52),
          radii: V(0.24, 0.13, 0.32),
          r: 0,
          color: mossBelly,
          tag: 'foot',
        },
        ...digits(V(x, 0.1, 0.72), {
          count: 3,
          spread: 0.28,
          length: 0.14,
          r: 0.07,
          color: mossBelly,
          tag: 'foot',
        }),
      ],
      box: [V(x - 0.5, -0.1, 0.0), V(x + 0.5, 0.55, 1.05)],
      resolution: 48,
    },
  };
}

export const MOSSLING_SPEC: SpeciesSpec = {
  name: 'Mossling',
  scale: 0.85,
  gait: 'biped',
  surface: { detail: 'leaf', scale: 1.4, amount: 0.5, bump: 0.5, roughness: 0.55, sheen: 0.35 },
  // Mossy fuzz over the body (the cap and arms opt out).
  fur: { layers: 3, length: 0.05, lift: 0.1, cell: 140 },
  blend: 0.18,
  torso: {
    prims: mosslingTorso(),
    box: [V(-1.7, 0, -1.3), V(1.7, 2.4, 1.3)],
    resolution: 104,
  },
  // The cap is the "head": it sways with the head pose and wears the dew and gills.
  head: {
    name: 'head',
    pivot: V(0, 2.0, 0),
    prims: [
      {
        kind: 'ellipsoid',
        a: V(0, 2.22, CAP_Z),
        radii: V(1.2, 0.58, 1.05),
        r: 0,
        color: mossCap,
        tag: 'cap',
      },
      {
        kind: 'torus',
        a: V(0, 2.07, CAP_Z),
        r: 0.9,
        r2: 0.17,
        color: '#f3e6c8',
        tag: 'rim',
        blend: 0.06,
      },
      {
        kind: 'cone',
        a: V(0.3, 2.7, -0.3),
        b: V(0.55, 3.2, -0.4),
        r: 0.1,
        r2: 0.02,
        color: '#4fa040',
        tag: 'sprout',
        blend: 0.05,
      },
      {
        kind: 'sphere',
        a: V(0.62, 3.23, -0.42),
        r: 0.12,
        color: '#8fd255',
        tag: 'sprout',
        blend: 0.05,
      },
    ],
    box: [V(-1.8, 1.5, -1.8), V(1.8, 3.6, 1.8)],
    blend: 0.1,
    resolution: 88,
    surface: {
      detail: 'smooth',
      amount: 0.3,
      bump: 0.3,
      roughness: 0.36,
      clearcoat: 0.45,
      sheen: 0.1,
    },
    shades: [spots(2.6, 0.64, '#fff1dc', ['cap'], 93)],
    noFur: true,
  },
  parts: [mosslingArm(-1), mosslingArm(1), mosslingLeg(-1), mosslingLeg(1)],
  // Short legs, quick light steps (one leg length a cycle) so the body barely crouches.
  stride: { length: 1, period: 0.55, duty: 0.5 },
  face: 'torso',
  shade: { top: 1.12, bottom: 0.66, yMax: 2.2 },
  marks: [],
  extraShades: [spots(3.0, 0.68, '#3e8a34', ['body'], 92)],
  eyes: {
    x: 0.3,
    y: 1.15,
    z: 0.78,
    r: 0.21,
    iris: '#3a8a2a',
    lidColor: mossBody,
    yaw: 0,
    lid: 0.2,
    irisScale: 0.8,
    tall: 1.1,
  },
  mouth: { x: 0, y: 0.86, z: 0.95, width: 0.2, lip: '#3a5a2a', teeth: false, tongue: '#ff9ab0' },
  extras: mosslingExtras,
  hipY: MOSSLING_HIP,
  notes:
    'Shape pass 2026-10-15 against the Palworld roster screenshot: cap smaller, raised and set ' +
    'back so the eyes show from the stage camera (docs/samples/shape-mossling.jpg).',
};

// ---------------------------------------------------------------- Bolder

const plate = '#56626f';
const plateLight = '#92a0b0';
const under = '#2e333c';
const ember = '#ff7a2a';

function bolderTorso(): Prim[] {
  const prims: Prim[] = [
    // Cephalothorax and a big abdomen behind it.
    {
      kind: 'ellipsoid',
      a: V(0, 0.95, 0.45),
      radii: V(0.95, 0.62, 0.8),
      r: 0,
      color: plate,
      tag: 'thorax',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.1, -0.95),
      radii: V(1.15, 0.85, 1.1),
      r: 0,
      color: plate,
      tag: 'abdomen',
    },
    // An ember seam between the segments, plate ridges down the back.
    { kind: 'torus', a: V(0, 1.05, -0.2), r: 0.62, r2: 0.09, color: ember, glow: 1, tag: 'seam' },
    {
      kind: 'capsule',
      a: V(0, 1.45, 0.5),
      b: V(0, 1.9, -0.9),
      r: 0.09,
      color: plateLight,
      tag: 'ridge',
    },
    {
      kind: 'capsule',
      a: V(-0.45, 1.3, -0.5),
      b: V(-0.5, 1.6, -1.5),
      r: 0.06,
      color: plateLight,
      tag: 'ridge',
    },
    {
      kind: 'capsule',
      a: V(0.45, 1.3, -0.5),
      b: V(0.5, 1.6, -1.5),
      r: 0.06,
      color: plateLight,
      tag: 'ridge',
    },
    // Spinnerets.
    {
      kind: 'cone',
      a: V(0, 0.9, -2.0),
      b: V(0, 0.8, -2.35),
      r: 0.14,
      r2: 0.03,
      color: under,
      tag: 'spin',
    },
  ];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const t = 0.25 + k * 0.18;
      prims.push({
        kind: 'sphere',
        a: V(side * (0.4 + 0.55 * t), 1.2 + 0.9 * t, 0.95 - 0.25 * t),
        r: 0.1 - k * 0.015,
        color: plateLight,
        tag: 'ridge',
      });
    }
  }
  return prims;
}

/** One jointed leg: hip to knee rising, knee to foot dropping, a claw at the end. */
function bolderLeg(side: number, i: number): SpeciesSpec['parts'][number] {
  const z = 1.0 - i * 0.6;
  const spread = 0.85 + Math.abs(i - 1.5) * 0.08;
  const hip = V(side * 0.75, 0.95, z);
  const knee = V(
    side * (0.75 + spread * 0.9),
    1.75 + (i === 0 || i === 3 ? 0.1 : 0.25),
    z + (i < 2 ? 0.35 : -0.35) * (i === 0 || i === 3 ? 1.6 : 1),
  );
  const foot = V(
    side * (0.75 + spread * 1.9),
    0.08,
    z + (i < 2 ? 0.75 : -0.75) * (i === 0 || i === 3 ? 1.5 : 1),
  );
  const suffix = i + 1 + (side < 0 ? 'L' : 'R');
  const surface = {
    detail: 'plate' as const,
    scale: 2.4,
    amount: 0.5,
    bump: 0.6,
    roughness: 0.45,
    clearcoat: 0.5,
  };
  // The thigh rises to the knee ball; the shin, on its own bone under the knee, drops
  // to the claw. Both carry the ball so the join stays round as the knee bends.
  return {
    name: 'leg' + suffix,
    pivot: hip,
    prims: [
      { kind: 'cone', a: hip, b: knee, r: 0.15, r2: 0.1, color: under, tag: 'leg' },
      { kind: 'sphere', a: knee, r: 0.12, color: plateLight, tag: 'knee' },
    ],
    box: [
      V(Math.min(hip.x, knee.x) - 0.5, hip.y - 0.4, Math.min(hip.z, knee.z) - 0.5),
      V(Math.max(hip.x, knee.x) + 0.5, 2.4, Math.max(hip.z, knee.z) + 0.5),
    ],
    blend: 0.06,
    resolution: 56,
    surface,
    joint: {
      name: 'knee' + suffix,
      pivot: knee,
      prims: [
        { kind: 'sphere', a: knee, r: 0.13, color: plateLight, tag: 'knee' },
        { kind: 'cone', a: knee, b: foot, r: 0.1, r2: 0.05, color: under, tag: 'leg' },
        ...digits(foot, {
          count: 2,
          spread: 0.14,
          length: 0.24,
          r: 0.045,
          color: plateLight,
          dir: V(side * 0.9, -0.2, 0.3),
          tag: 'claw',
        }),
      ],
      box: [
        V(Math.min(knee.x, foot.x) - 0.5, -0.2, Math.min(knee.z, foot.z) - 0.5),
        V(Math.max(knee.x, foot.x) + 0.5, knee.y + 0.4, Math.max(knee.z, foot.z) + 0.5),
      ],
    },
  };
}

/** Mandibles under the face, the ember light inside the abdomen, the pulsing glow. */
function bolderExtras({ hips, bones, mat }: RigContext): (t: number) => void {
  const head = bones.head!;
  const mandible = new THREE.MeshPhysicalMaterial({
    color: plateLight,
    roughness: 0.35,
    clearcoat: 0.6,
  });
  const jaws: THREE.Mesh[] = [];
  for (const dx of [-0.22, 0.22]) {
    const j = add(
      head,
      new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.5, 10), mandible),
      dx,
      0.5 - 0.8,
      1.6 - 0.95,
    );
    j.rotation.x = Math.PI / 2 + 0.3;
    j.rotation.z = -dx * 1.4;
    jaws.push(j);
  }
  const emberLight = new THREE.PointLight('#ff7a2a', 3, 4.5, 1.5);
  emberLight.position.set(0, 1.4 - BOLDER_HIP, -0.9);
  hips.add(emberLight);
  return (t) => {
    jaws.forEach((j, i) => {
      j.rotation.z =
        -(i === 0 ? -0.22 : 0.22) * 1.4 + Math.sin(t * 2.2) * 0.14 * (i === 0 ? 1 : -1);
    });
    emberLight.intensity = 2.5 + Math.sin(t * 2.7) * 0.9;
    const u = (
      mat.userData.shader as { uniforms: { uGlowStrength: { value: number } } } | undefined
    )?.uniforms;
    if (u) u.uGlowStrength.value = 3.2 + Math.sin(t * 2.7) * 1.2;
  };
}

const BOLDER_HIP = 0.95;

/** The head's ellipsoid, also in the torso sculpt: the thorax blends into it there, so the neck has a fillet instead of a seam. */
const bolderSkull: Prim = {
  kind: 'ellipsoid',
  a: V(0, 0.72, 1.15),
  radii: V(0.62, 0.46, 0.5),
  r: 0,
  color: under,
  tag: 'head',
};

export const BOLDER_SPEC: SpeciesSpec = {
  name: 'Bolder',
  scale: 0.72,
  gait: 'spider',
  surface: {
    detail: 'plate',
    scale: 1.2,
    amount: 0.7,
    bump: 1.0,
    roughness: 0.38,
    sheen: 0.05,
    clearcoat: 0.7,
    glowStrength: 4,
  },
  blend: 0.12,
  torso: {
    prims: [...bolderTorso(), bolderSkull],
    box: [V(-1.6, 0, -2.6), V(1.6, 2.5, 2.2)],
    resolution: 104,
  },
  // The head sits low in front with the horns and pedipalps.
  head: {
    name: 'head',
    pivot: V(0, 0.8, 0.95),
    prims: [
      bolderSkull,
      {
        kind: 'cone',
        a: V(-0.4, 1.2, 0.95),
        b: V(-0.95, 2.1, 0.7),
        r: 0.17,
        r2: 0.03,
        color: plateLight,
        tag: 'horn',
        blend: 0.04,
      },
      {
        kind: 'cone',
        a: V(0.4, 1.2, 0.95),
        b: V(0.95, 2.1, 0.7),
        r: 0.17,
        r2: 0.03,
        color: plateLight,
        tag: 'horn',
        blend: 0.04,
      },
      {
        kind: 'capsule',
        a: V(-0.3, 0.5, 1.4),
        b: V(-0.55, 0.35, 1.9),
        r: 0.08,
        color: under,
        tag: 'palp',
        blend: 0.04,
      },
      {
        kind: 'capsule',
        a: V(0.3, 0.5, 1.4),
        b: V(0.55, 0.35, 1.9),
        r: 0.08,
        color: under,
        tag: 'palp',
        blend: 0.04,
      },
    ],
    box: [V(-1.3, 0, 0.3), V(1.3, 2.4, 2.2)],
    blend: 0.12,
    resolution: 72,
  },
  parts: [0, 1, 2, 3].flatMap((i) => [bolderLeg(-1, i), bolderLeg(1, i)]),
  shade: { top: 1.14, bottom: 0.5, yMax: 2.2 },
  marks: [],
  colorRules: namedRule('bolder.colors', (p, n) => {
    if (n.tag === 'abdomen') {
      // An ember hourglass across the back of the abdomen, plate seams either side.
      const lx = Math.abs(p.x);
      const ly = p.z + 0.95;
      const hour = lx < 0.12 + Math.abs(ly) * 0.55 && Math.abs(ly) < 0.7 && p.y > 1.05;
      if (hour) return ember;
      const seam = Math.abs(Math.sin(p.z * 5.5)) < 0.08 && p.y > 1.2;
      return seam ? '#7a8898' : plate;
    }
    if (n.tag === 'thorax')
      return Math.abs(Math.sin(p.x * 5)) < 0.08 && p.y > 1.1 ? '#7a8898' : plate;
    return null;
  }),
  eyes: {
    x: 0.26,
    y: 0.92,
    z: 1.58,
    r: 0.14,
    iris: '#ffb020',
    lidColor: under,
    yaw: 0,
    lid: 0.35,
    irisScale: 0.8,
    tall: 1.0,
    // A row of six small eyes across the brow.
    extra: [0, 1, 2, 3, 4, 5].map((i) => ({
      x: -0.42 + i * 0.168,
      y: 1.12 - Math.abs(i - 2.5) * 0.03,
      z: 1.5 - Math.abs(i - 2.5) * 0.06,
      r: 0.05 + (i === 2 || i === 3 ? 0.015 : 0),
    })),
  },
  mouth: { x: 0, y: 0.5, z: 1.62, width: 0.26, lip: '#1e2228', teeth: true, tongue: '#c03a4a' },
  extras: bolderExtras,
  hipY: BOLDER_HIP,
  notes:
    'Shape pass 2026-10-15 against the Palworld roster screenshot: scale 0.72, thorax blended ' +
    'into the head, crisp horns (docs/samples/shape-bolder.jpg); the planted walk against the ' +
    'All Pet Animations video (walk-bolder.jpg).',
};

// ---------------------------------------------------------------- Wisp

const smoke = '#6b3fb0';
const wispDark = '#2a1a4a';
const core = '#d8f6ff';
const WISP_HIP = 1.7;

const FLAMES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 0, 1.15, 0.1],
  [-0.32, -0.12, 0.9, -0.38],
  [0.34, -0.1, 0.85, 0.42],
  [-0.1, -0.38, 0.65, -0.1],
  [0.15, -0.4, 0.55, 0.2],
];

const flameSurface = {
  detail: 'smooth',
  amount: 0.2,
  bump: 0.2,
  roughness: 0.3,
  clearcoat: 0.3,
  glowStrength: 2.4,
} as const;

function wispSkirt(i: number): SpeciesSpec['parts'][number] {
  const a = (i / 6) * Math.PI * 2 + 0.3;
  const x = Math.cos(a) * 0.55;
  const z = Math.sin(a) * 0.5;
  return {
    name: 'skirt' + i,
    pivot: V(x, 1.05, z),
    prims: [
      {
        kind: 'cone',
        a: V(x, 1.05, z),
        b: V(x * 1.6, 0.25 + (i % 2) * 0.2, z * 1.6),
        r: 0.16,
        r2: 0.02,
        color: wispDark,
        tag: 'skirt',
      },
    ],
    box: [V(x * 1.6 - 0.4, -0.1, z * 1.6 - 0.4), V(x * 1.6 + 0.4, 1.3, z * 1.6 + 0.4)],
    blend: 0.05,
    resolution: 40,
    surface: flameSurface,
  };
}

/** The vapour shell, the mote ring, the trail, the inner light and the skirt's sway. */
function wispExtras({ hips, bones, meshes, mat }: RigContext): (t: number) => void {
  const time = { value: 0 };
  smokeShell(hips, meshes.torso!, '#8a5ad8', time);
  const trail = new THREE.Group();
  const trailMat = new THREE.MeshBasicMaterial({
    color: '#c8b0ff',
    transparent: true,
    opacity: 0.7,
  });
  for (let i = 0; i < 8; i++)
    trail.add(new THREE.Mesh(new THREE.SphereGeometry(0.09 - i * 0.009, 8, 6), trailMat));
  hips.add(trail);
  const motes = new THREE.Group();
  const moteMat = new THREE.MeshBasicMaterial({ color: '#d8f6ff' });
  for (let i = 0; i < 18; i++)
    motes.add(new THREE.Mesh(new THREE.SphereGeometry(0.03 + (i % 3) * 0.015, 8, 6), moteMat));
  hips.add(motes);
  const ring = add(
    hips,
    new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.02, 8, 64),
      new THREE.MeshBasicMaterial({ color: '#b9a0ff', transparent: true, opacity: 0.5 }),
    ),
    0,
    1.3 - WISP_HIP,
    0,
  );
  ring.rotation.x = Math.PI / 2 + 0.3;
  // The core has a material of its own, so the body's glow strength cannot dim it.
  const coreMat = new THREE.MeshStandardMaterial({
    color: core,
    emissive: new THREE.Color(core),
    emissiveIntensity: 2.2,
    roughness: 0.4,
    toneMapped: false,
  });
  const coreMesh = add(
    hips,
    new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), coreMat),
    0,
    1.1 - WISP_HIP,
    0.55,
  );
  coreMesh.scale.set(0.3, 0.28, 0.26);
  coreMesh.castShadow = false;
  const light = new THREE.PointLight('#9ad8ff', 5, 6, 1.5);
  light.position.set(0, 1.8 - WISP_HIP, 0.4);
  hips.add(light);
  const skirt = [0, 1, 2, 3, 4, 5].map((i) => bones['skirt' + i]!);
  return (t) => {
    time.value = t;
    skirt.forEach((s, i) => {
      s.rotation.z = Math.sin(t * 2.1 + i * 1.1) * 0.22;
      s.rotation.x = Math.cos(t * 1.7 + i * 0.8) * 0.18;
    });
    motes.children.forEach((m, i) => {
      const a = t * 0.9 + i * 0.35;
      const rr = 0.9 + (i % 3) * 0.22;
      m.position.set(
        Math.cos(a) * rr,
        1.5 - WISP_HIP + Math.sin(a * 1.7) * 0.6 + (i % 2) * 0.3,
        Math.sin(a) * rr,
      );
    });
    ring.rotation.z = t * 0.5;
    light.intensity = 4 + Math.sin(t * 3) * 1.2;
    coreMat.emissiveIntensity = 2.2 + Math.sin(t * 2.6) * 0.7;
    trail.children.forEach((m, i) => {
      const k = i / 8;
      m.position.set(
        0.3 + k * 0.9 + Math.sin(t * 2 + k * 6) * 0.15,
        0.1 - WISP_HIP - k * 0.9 + Math.sin(t * 1.4 + k * 4) * 0.1,
        -0.2 - k * 0.6,
      );
    });
    const u = (
      mat.userData.shader as { uniforms: { uGlowStrength: { value: number } } } | undefined
    )?.uniforms;
    if (u) u.uGlowStrength.value = 2.6 + Math.sin(t * 2.2) * 0.9;
  };
}

export const WISP_SPEC: SpeciesSpec = {
  name: 'Wisp',
  scale: 0.85,
  gait: 'hover',
  hover: 0.55,
  surface: {
    detail: 'smooth',
    amount: 0.3,
    bump: 0.35,
    roughness: 0.26,
    sheen: 0.3,
    sheenColor: '#d0a0ff',
    clearcoat: 0.5,
    glowStrength: 3.0,
  },
  blend: 0.3,
  torso: {
    prims: [
      {
        kind: 'ellipsoid',
        a: V(0, 1.7, 0),
        radii: V(0.84, 0.94, 0.82),
        r: 0,
        color: smoke,
        tag: 'body',
      },
      {
        kind: 'ellipsoid',
        a: V(0, 1.1, 0.5),
        radii: V(0.38, 0.36, 0.4),
        r: 0,
        color: core,
        glow: 1,
        tag: 'core',
        blend: 0.1,
      },
      {
        kind: 'cone',
        a: V(0, 1.0, 0),
        b: V(0.3, 0.1, -0.2),
        r: 0.46,
        r2: 0.03,
        color: wispDark,
        tag: 'tail',
      },
      {
        kind: 'cone',
        a: V(-0.7, 1.6, 0.1),
        b: V(-1.6, 2.25, 0.3),
        r: 0.2,
        r2: 0.03,
        color: smoke,
        tag: 'arm',
      },
      {
        kind: 'cone',
        a: V(0.7, 1.6, 0.1),
        b: V(1.6, 2.25, 0.3),
        r: 0.2,
        r2: 0.03,
        color: smoke,
        tag: 'arm',
      },
      { kind: 'sphere', a: V(-1.6, 2.25, 0.3), r: 0.13, color: core, glow: 0.7, tag: 'armtip' },
      { kind: 'sphere', a: V(1.6, 2.25, 0.3), r: 0.13, color: core, glow: 0.7, tag: 'armtip' },
      ...[-1, 1].flatMap((s) =>
        digits(V(s * 1.62, 2.28, 0.32), {
          count: 3,
          spread: 0.26,
          length: 0.26,
          r: 0.055,
          color: core,
          glow: 0.8,
          style: 'fingers',
          dir: V(s * 0.55, 0.75, 0.3),
          tag: 'armtip',
        }),
      ),
      // Horn tufts curling back from the brow, a brow ridge and cheek flares.
      {
        kind: 'cone',
        a: V(-0.5, 2.35, 0.3),
        b: V(-0.9, 2.95, -0.2),
        r: 0.14,
        r2: 0.02,
        color: wispDark,
        tag: 'horn',
      },
      {
        kind: 'cone',
        a: V(0.5, 2.35, 0.3),
        b: V(0.9, 2.95, -0.2),
        r: 0.14,
        r2: 0.02,
        color: wispDark,
        tag: 'horn',
      },
      {
        kind: 'capsule',
        a: V(-0.45, 2.22, 0.62),
        b: V(0.45, 2.22, 0.62),
        r: 0.08,
        color: wispDark,
        tag: 'brow',
      },
      {
        kind: 'cone',
        a: V(-0.8, 1.6, 0.4),
        b: V(-1.15, 1.35, 0.55),
        r: 0.1,
        r2: 0.02,
        color: wispDark,
        tag: 'flare',
      },
      {
        kind: 'cone',
        a: V(0.8, 1.6, 0.4),
        b: V(1.15, 1.35, 0.55),
        r: 0.1,
        r2: 0.02,
        color: wispDark,
        tag: 'flare',
      },
    ],
    box: [V(-1.9, -0.2, -1.4), V(1.9, 3.2, 1.4)],
    resolution: 104,
  },
  // The crown of flames is the "head", so it sways with the head pose.
  head: {
    name: 'head',
    pivot: V(0, 2.45, 0),
    prims: FLAMES.flatMap(([x, z, h, lean]): Prim[] => [
      {
        kind: 'cone',
        a: V(x, 2.45, z),
        b: V(x + lean, 2.45 + h, z - 0.1),
        r: 0.22,
        r2: 0.03,
        color: smoke,
        tag: 'flame',
      },
      {
        kind: 'cone',
        a: V(x, 2.5, z),
        b: V(x + lean * 0.7, 2.45 + h * 0.6, z - 0.05),
        r: 0.1,
        r2: 0.02,
        color: core,
        glow: 0.9,
        tag: 'inner',
      },
    ]),
    box: [V(-1.3, 2.1, -1.3), V(1.3, 3.9, 1.1)],
    blend: 0.08,
    resolution: 72,
    surface: flameSurface,
  },
  parts: [0, 1, 2, 3, 4, 5].map(wispSkirt),
  face: 'torso',
  shade: { top: 1.15, bottom: 0.45, yMax: 2.8 },
  marks: [],
  extraShades: [
    spots(2.2, 0.66, '#9a6ad8', ['body'], 94),
    spots(5.0, 0.7, '#3a2460', ['body', 'tail'], 95),
  ],
  eyes: {
    x: 0.27,
    y: 1.9,
    z: 0.82,
    r: 0.2,
    iris: '#b9ff5a',
    lidColor: smoke,
    yaw: 0,
    lid: 0.2,
    irisScale: 0.8,
    tall: 1.15,
  },
  mouth: { x: 0, y: 1.56, z: 0.88, width: 0.3, lip: '#1a0f2e', teeth: true, tongue: '#ff6a9a' },
  extras: wispExtras,
  hipY: WISP_HIP,
  notes:
    'Shape pass 2026-10-15 against the Palworld roster screenshot: the core sits on the belly ' +
    'with its own emissive glow, glowing three-finger hands (docs/samples/shape-wisp.jpg).',
};

/** The five sample creatures, in stage order. */
export const ROSTER: SpeciesSpec[] = [
  NUBBIN_SPEC,
  MOSSLING_SPEC,
  FENNEL_SPEC,
  BOLDER_SPEC,
  WISP_SPEC,
];
