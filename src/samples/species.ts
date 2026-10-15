import * as THREE from 'three';
import {
  add,
  blink,
  combine,
  eye,
  furShells,
  glossy,
  gradient,
  surfaceMaterial,
  type Creature,
  type Shade,
  type SurfaceOpts,
} from './creatures';
import { sculpt, sdf, smin, V, type Prim } from './sculpted';

/**
 * The species description format: a creature as data. A spec names the body parts
 * as blended shapes (torso, head, limbs, tail, ears, wings), the surface, the baked
 * light, deliberate markings, the eyes and the mouth, and how fur grows. The builder
 * turns it into a rigged figure (every part on a pivot) with a modelled mouth and
 * poses the sim can drive: idle, happy, walk, eat, sleep. The whole roster is meant
 * to be written in this format rather than modelled by hand.
 */
export type Gait = 'biped' | 'quadruped' | 'hover';
export type PoseName = 'idle' | 'happy' | 'walk' | 'eat' | 'sleep';
export const POSES: PoseName[] = ['idle', 'happy', 'walk', 'eat', 'sleep'];

/** A deliberate marking: a shape in body space, a colour, and how soft its edge is. */
export interface Mark {
  kind: 'ellipsoid' | 'sphere' | 'capsule';
  a: THREE.Vector3;
  b?: THREE.Vector3;
  r?: number;
  radii?: THREE.Vector3;
  color: string;
  soft?: number;
}

export interface PartSpec {
  /** A bone name the poser knows: head, armL, armR, legL, legR, legFL, legFR, legBL, legBR, tail, earL, earR. */
  name: string;
  /** Where the part hangs from, in body space. */
  pivot: THREE.Vector3;
  prims: Prim[];
  box: [THREE.Vector3, THREE.Vector3];
  blend?: number;
  resolution?: number;
}

export interface SpeciesSpec {
  name: string;
  scale: number;
  gait: Gait;
  surface: SurfaceOpts;
  /** Shell fur over the furred parts, if any. */
  fur?: { layers: number; length: number; lift: number; cell: number };
  /** Fur length (0..1) and growth direction per surface point. */
  furRule?: (
    p: THREE.Vector3,
    n: THREE.Vector3,
    nearest: Prim,
  ) => { len: number; dir: THREE.Vector3 };
  torso: {
    prims: Prim[];
    box: [THREE.Vector3, THREE.Vector3];
    blend?: number;
    resolution?: number;
  };
  head: PartSpec;
  parts: PartSpec[];
  /** Blend radius for the body sculpts. */
  blend: number;
  shade: { top: number; bottom: number; yMax: number };
  marks: Mark[];
  colorRules?: (p: THREE.Vector3, nearest: Prim) => string | null;
  extraShades?: Shade[];
  eyes: {
    x: number;
    y: number;
    z: number;
    r: number;
    iris: string;
    lidColor: string;
    yaw: number;
    lid: number;
    irisScale: number;
    /** Extra tilt of each eye beyond the face normal, radians. */
    pitch?: number;
    /** Height of the eye relative to its width; 1 is round. */
    tall?: number;
  };
  mouth: {
    x: number;
    y: number;
    z: number;
    width: number;
    lip: string;
    teeth: boolean;
    tongue: string;
    /** Tilt of the mouth to follow the face, radians; down and out by default. */
    pitch?: number;
  };
  wings?: { x: number; y: number; z: number; size: number; color: string };
  /** The Chao emote ball, if the species has one. */
  ball?: { y: number; color: string };
  /** Hip height: the body bobs from here. */
  hipY: number;
}

export interface Rigged extends Creature {
  setPose(pose: PoseName): void;
  bones: Record<string, THREE.Group>;
}

// ---------------------------------------------------------------- marks and fur

function markShade(marks: Mark[]): Shade {
  const colors = marks.map((m) => new THREE.Color(m.color));
  const prims: Prim[] = marks.map((m) => ({
    kind: m.kind,
    a: m.a,
    ...(m.b ? { b: m.b } : {}),
    r: m.r ?? 0,
    ...(m.radii ? { radii: m.radii } : {}),
    color: m.color,
  }));
  return (p, _n, c) => {
    for (let i = 0; i < prims.length; i++) {
      const d = sdf(p, prims[i]!);
      const soft = marks[i]!.soft ?? 0.06;
      if (d < soft) c.lerp(colors[i]!, THREE.MathUtils.clamp(1 - d / soft, 0, 1));
    }
  };
}

// ---------------------------------------------------------------- the mouth

interface Mouth {
  group: THREE.Group;
  open(amount: number): void;
}

/**
 * The nearest point on a sculpted part's surface to `from`, and the outward normal
 * there, found by walking down the signed distance field. Eyes and the mouth are set
 * on the face with this, so they sit in the skin whatever the head's shape.
 */
function onSurface(
  prims: Prim[],
  blend: number,
  from: THREE.Vector3,
): { pos: THREE.Vector3; normal: THREE.Vector3 } {
  const field = (p: THREE.Vector3): number => {
    let d = 1e9;
    for (const q of prims) d = smin(d, sdf(p, q), blend);
    return d;
  };
  const pos = from.clone();
  const normal = new THREE.Vector3();
  const t = new THREE.Vector3();
  const e = 0.004;
  for (let i = 0; i < 10; i++) {
    const d = field(pos);
    normal
      .set(
        field(t.set(pos.x + e, pos.y, pos.z)) - field(t.set(pos.x - e, pos.y, pos.z)),
        field(t.set(pos.x, pos.y + e, pos.z)) - field(t.set(pos.x, pos.y - e, pos.z)),
        field(t.set(pos.x, pos.y, pos.z + e)) - field(t.set(pos.x, pos.y, pos.z - e)),
      )
      .normalize();
    pos.addScaledVector(normal, -d);
    if (Math.abs(d) < 1e-4) break;
  }
  return { pos, normal };
}

/**
 * A modelled mouth set into the face: a thin lip line on the surface, and behind it a
 * dark interior that only shows as the mouth opens, with a tongue and teeth inside.
 */
function buildMouth(parent: THREE.Object3D, m: SpeciesSpec['mouth']): Mouth {
  const g = new THREE.Group();
  g.position.set(m.x, m.y, m.z);
  g.rotation.x = m.pitch ?? 0;
  const w = m.width;
  const interior = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(1, 28, 18),
      new THREE.MeshPhysicalMaterial({ color: '#3a1424', roughness: 0.7 }),
    ),
    0,
    0,
    -w * 0.42,
  );
  interior.scale.set(w * 0.5, w * 0.03, w * 0.44);
  interior.castShadow = false;
  const tongue = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      glossy(m.tongue, { roughness: 0.35, clearcoat: 0.6 }),
    ),
    0,
    -w * 0.1,
    -w * 0.3,
  );
  tongue.scale.set(w * 0.26, w * 0.08, w * 0.3);
  tongue.visible = false;
  tongue.castShadow = false;
  const teeth: THREE.Mesh[] = [];
  if (m.teeth) {
    for (const dx of [-0.6, 0.6]) {
      const t = add(
        g,
        new THREE.Mesh(
          new THREE.ConeGeometry(w * 0.06, w * 0.16, 6),
          new THREE.MeshPhysicalMaterial({ color: '#fbf6ea', roughness: 0.3 }),
        ),
        dx * w * 0.5,
        w * 0.04,
        -w * 0.12,
      );
      t.rotation.x = Math.PI;
      t.visible = false;
      t.castShadow = false;
      teeth.push(t);
    }
  }
  // The lip line lies on the surface; it widens into a ring as the mouth opens.
  const lipMat = new THREE.MeshPhysicalMaterial({ color: m.lip, roughness: 0.6 });
  const lip = add(
    g,
    new THREE.Mesh(new THREE.TorusGeometry(w * 0.5, w * 0.045, 8, 28, Math.PI), lipMat),
    0,
    w * 0.02,
    -w * 0.02,
  );
  lip.rotation.z = Math.PI;
  lip.castShadow = false;
  const lower = add(
    g,
    new THREE.Mesh(new THREE.TorusGeometry(w * 0.47, w * 0.04, 8, 28, Math.PI), lipMat),
    0,
    w * 0.02,
    -w * 0.03,
  );
  lower.rotation.z = Math.PI;
  lower.castShadow = false;
  lower.visible = false;
  parent.add(g);
  return {
    group: g,
    open: (amount) => {
      const k = THREE.MathUtils.clamp(amount, 0, 1);
      interior.scale.y = w * (0.03 + k * 0.34);
      interior.position.y = -w * k * 0.16;
      // The upper lip stays; the lower lip drops and flips into a ring.
      lower.visible = k > 0.04;
      lower.position.y = w * 0.02 - k * w * 0.34;
      lower.rotation.z = Math.PI + k * Math.PI;
      lower.scale.set(1, 0.2 + k * 0.8, 1);
      tongue.visible = k > 0.25;
      tongue.position.y = -w * (0.1 + k * 0.2);
      for (const t of teeth) t.visible = k > 0.3;
    },
  };
}

// ---------------------------------------------------------------- the builder

function sculptPart(
  spec: SpeciesSpec,
  prims: Prim[],
  box: [THREE.Vector3, THREE.Vector3],
  blend: number,
  res: number,
): THREE.BufferGeometry {
  const shades: Shade[] = [gradient(spec.shade.top, spec.shade.bottom, 0, spec.shade.yMax)];
  if (spec.marks.length) shades.push(markShade(spec.marks));
  if (spec.extraShades) shades.push(...spec.extraShades);
  return sculpt(
    {
      prims,
      blend,
      min: box[0],
      max: box[1],
      ...(spec.colorRules
        ? { colorAt: (p: THREE.Vector3, q: Prim) => spec.colorRules!(p, q) ?? q.color }
        : {}),
      shade: combine(...shades),
      ...(spec.furRule ? { fur: spec.furRule } : {}),
    },
    res,
  );
}

export function buildSpecies(spec: SpeciesSpec): Rigged {
  const root = new THREE.Group();
  const mat = surfaceMaterial(spec.surface);
  const bones: Record<string, THREE.Group> = {};
  const furred: Array<{ parent: THREE.Object3D; mesh: THREE.Mesh }> = [];

  // Hips carry the torso; everything else hangs from the torso or the hips.
  const hips = new THREE.Group();
  hips.position.set(0, spec.hipY, 0);
  root.add(hips);
  bones.hips = hips;
  const torsoGeo = sculptPart(
    spec,
    spec.torso.prims,
    spec.torso.box,
    spec.torso.blend ?? spec.blend,
    spec.torso.resolution ?? 104,
  );
  torsoGeo.translate(0, -spec.hipY, 0);
  const torso = new THREE.Mesh(torsoGeo, mat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  hips.add(torso);
  bones.torso = hips;
  furred.push({ parent: hips, mesh: torso });

  const hang = (ps: PartSpec, parent: THREE.Group, parentOrigin: THREE.Vector3): THREE.Group => {
    const geo = sculptPart(spec, ps.prims, ps.box, ps.blend ?? spec.blend, ps.resolution ?? 80);
    geo.translate(-ps.pivot.x, -ps.pivot.y, -ps.pivot.z);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const pivot = new THREE.Group();
    pivot.position.copy(ps.pivot).sub(parentOrigin);
    pivot.add(mesh);
    parent.add(pivot);
    bones[ps.name] = pivot;
    furred.push({ parent: pivot, mesh });
    return pivot;
  };
  const hipOrigin = new THREE.Vector3(0, spec.hipY, 0);
  const head = hang(spec.head, hips, hipOrigin);
  for (const ps of spec.parts) hang(ps, hips, hipOrigin);

  if (spec.fur) {
    for (const f of furred)
      furShells(
        f.parent,
        f.mesh,
        spec.fur.layers,
        spec.fur.length,
        spec.fur.lift,
        spec.fur.cell,
        !!spec.furRule,
      );
  }

  // The face: eyes and the mouth hang from the head.
  const e = spec.eyes;
  const headOrigin = spec.head.pivot;
  const lids: THREE.Mesh[] = [];
  const headBlend = spec.head.blend ?? spec.blend;
  const forward = new THREE.Vector3(0, 0, 1);
  for (const side of [-1, 1]) {
    // Each eye sits in the skin where the spec's point lands on the face, aimed along
    // the surface normal pulled a little toward straight ahead.
    const at = onSurface(spec.head.prims, headBlend, V(side * e.x, e.y, e.z));
    const r = eye(head, 0, 0, 0, e.r, e.iris, e.lidColor, 0, e.lid, e.irisScale, 0, e.tall ?? 1.2);
    r.group.position.copy(at.pos).sub(headOrigin);
    r.group.quaternion.setFromUnitVectors(
      forward,
      at.normal.addScaledVector(forward, 0.22).normalize(),
    );
    r.group.rotateY(side * e.yaw);
    r.group.rotateX(e.pitch ?? 0);
    lids.push(r.lid);
  }
  const mouthAt = onSurface(
    spec.head.prims,
    headBlend,
    V(spec.mouth.x, spec.mouth.y, spec.mouth.z),
  );
  const mouth = buildMouth(head, {
    ...spec.mouth,
    x: mouthAt.pos.x - headOrigin.x,
    y: mouthAt.pos.y - headOrigin.y,
    z: mouthAt.pos.z - headOrigin.z,
    pitch: 0,
  });
  mouth.group.quaternion.setFromUnitVectors(forward, mouthAt.normal);
  mouth.group.rotateX(spec.mouth.pitch ?? 0);

  // Wings and the ball are species extras.
  const wings: THREE.Group[] = [];
  if (spec.wings) {
    const w = spec.wings;
    for (const dx of [-1, 1]) {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(0.46 * dx * w.size, 0.5 * w.size, 0.16 * dx * w.size, 1.0 * w.size);
      shape.quadraticCurveTo(-0.18 * dx * w.size, 0.55 * w.size, 0, 0);
      const pivot = new THREE.Group();
      pivot.position.set(dx * w.x, w.y - spec.hipY, w.z);
      pivot.rotation.y = -dx * 0.5;
      pivot.add(
        new THREE.Mesh(
          new THREE.ShapeGeometry(shape, 18),
          new THREE.MeshPhysicalMaterial({
            color: w.color,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            roughness: 0.2,
            transmission: 0.3,
          }),
        ),
      );
      hips.add(pivot);
      wings.push(pivot);
      bones[dx < 0 ? 'wingL' : 'wingR'] = pivot;
    }
  }
  let ball: THREE.Mesh | null = null;
  let ballMat: THREE.MeshPhysicalMaterial | null = null;
  if (spec.ball) {
    ballMat = glossy(spec.ball.color, {
      emissive: new THREE.Color('#9a7010'),
      emissiveIntensity: 1.4,
    });
    ball = add(
      head,
      new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 18), ballMat),
      0,
      spec.ball.y - headOrigin.y,
      0,
    );
    const light = new THREE.PointLight('#ffe08a', 1.2, 2.5, 1.6);
    light.position.copy(ball.position);
    head.add(light);
  }

  root.scale.setScalar(spec.scale);

  // ---- poses ----
  let pose: PoseName = 'idle';
  let poseSince = 0;
  const rest: Record<string, THREE.Euler> = {};
  for (const [k, b] of Object.entries(bones)) rest[k] = b.rotation.clone();
  const set = (name: string, x: number, y: number, z: number) => {
    const b = bones[name];
    if (!b) return;
    const r = rest[name]!;
    b.rotation.set(r.x + x, r.y + y, r.z + z);
  };
  const quad = spec.gait === 'quadruped';
  const animate = (t: number) => {
    const dt = t - poseSince;
    const s = Math.sin;
    hips.position.y = spec.hipY;
    hips.rotation.set(0, 0, 0);
    let lidClose = 0;
    let mouthOpen = 0;
    switch (pose) {
      case 'idle': {
        hips.position.y = spec.hipY + s(t * 2.2) * 0.02;
        hips.rotation.z = s(t * 0.8) * 0.02;
        set('head', s(t * 1.1) * 0.05, s(t * 0.7) * 0.14, s(t * 0.9) * 0.07);
        if (quad) {
          for (const n of ['legFL', 'legFR', 'legBL', 'legBR']) set(n, 0, 0, 0);
          set('tail', s(t * 1.3) * 0.12, s(t * 2.6) * 0.45, 0);
        } else {
          set('armL', 0, 0, s(t * 1.6) * 0.08);
          set('armR', 0, 0, -s(t * 1.6 + 1) * 0.08);
          set('legL', 0, 0, 0);
          set('legR', 0, 0, 0);
        }
        mouthOpen = 0.05;
        break;
      }
      case 'happy': {
        const hop = Math.abs(s(t * 6));
        hips.position.y = spec.hipY + hop * 0.22;
        hips.rotation.z = s(t * 6) * 0.06;
        set('head', -0.08, 0, s(t * 6) * 0.22);
        if (quad) {
          set('legFL', -0.6 * hop, 0, 0);
          set('legFR', -0.6 * hop, 0, 0);
          set('legBL', 0.2 * hop, 0, 0);
          set('legBR', 0.2 * hop, 0, 0);
          set('tail', 0.3, s(t * 7) * 0.7, 0);
        } else {
          set('armL', 0, 0, 1.3 + s(t * 7) * 0.35);
          set('armR', 0, 0, -1.3 - s(t * 7 + 1) * 0.35);
          set('legL', -0.3 * hop, 0, 0);
          set('legR', -0.3 * hop, 0, 0);
        }
        mouthOpen = 0.75;
        break;
      }
      case 'walk': {
        const w = t * 7;
        hips.position.y = spec.hipY + Math.abs(s(w)) * 0.05;
        hips.rotation.x = -0.06;
        hips.rotation.z = s(w) * 0.03;
        set('head', s(w * 2) * 0.03, 0, 0);
        if (quad) {
          set('legFL', s(w) * 0.55, 0, 0);
          set('legBR', s(w) * 0.55, 0, 0);
          set('legFR', -s(w) * 0.55, 0, 0);
          set('legBL', -s(w) * 0.55, 0, 0);
          set('tail', 0.15, s(w * 0.5) * 0.3, 0);
        } else {
          set('legL', s(w) * 0.55, 0, 0);
          set('legR', -s(w) * 0.55, 0, 0);
          set('armL', -s(w) * 0.4, 0, 0.15);
          set('armR', s(w) * 0.4, 0, -0.15);
        }
        mouthOpen = 0.1;
        break;
      }
      case 'eat': {
        const chomp = Math.max(0, s(t * 5));
        set('head', 0.42 + chomp * 0.08, 0, s(t * 0.9) * 0.05);
        if (quad) {
          set('legFL', 0.15, 0, 0);
          set('legFR', 0.15, 0, 0);
          hips.rotation.x = 0.08;
          set('tail', 0.1, s(t * 1.5) * 0.2, 0);
        } else {
          set('armL', -1.1, 0.3, 0.6);
          set('armR', -1.1, -0.3, -0.6);
        }
        mouthOpen = 0.25 + chomp * 0.6;
        break;
      }
      case 'sleep': {
        const ease = Math.min(1, dt / 1.2);
        hips.position.y = spec.hipY - (quad ? 0.28 : 0.1) * ease + s(t * 1.1) * 0.015;
        hips.rotation.x = (quad ? 0.05 : 0.22) * ease;
        set('head', 0.5 * ease, 0, 0.12 * ease);
        if (quad) {
          for (const n of ['legFL', 'legFR']) set(n, -1.2 * ease, 0, 0);
          for (const n of ['legBL', 'legBR']) set(n, 1.2 * ease, 0, 0);
          set('tail', 0.6 * ease, 0.9 * ease, 0);
        } else {
          set('armL', -0.3 * ease, 0, 0.3 * ease);
          set('armR', -0.3 * ease, 0, -0.3 * ease);
        }
        lidClose = ease;
        mouthOpen = 0.08;
        break;
      }
    }
    // Ears, wings, the ball and the blink run on top of every pose.
    set('earL', 0, 0, s(t * 3.1) * 0.08 + (pose === 'sleep' ? -0.3 : 0));
    set('earR', 0, 0, -s(t * 3.1 + 2) * 0.08 + (pose === 'sleep' ? 0.3 : 0));
    wings.forEach((w, i) => {
      const flap = pose === 'happy' ? 0.7 : pose === 'sleep' ? 0.08 : 0.35;
      w.rotation.y = -(i === 0 ? -1 : 1) * 0.5 + s(t * 9 + i) * flap * (i === 0 ? -1 : 1);
    });
    if (ball && ballMat) {
      ball.position.y =
        spec.ball!.y - headOrigin.y + s(t * 1.6) * 0.08 + (pose === 'happy' ? 0.15 : 0);
      ballMat.emissiveIntensity = (pose === 'sleep' ? 0.5 : 1.3) + s(t * 2.4) * 0.4;
    }
    mouth.open(mouthOpen);
    if (lidClose > 0)
      for (const l of lids) l.rotation.x = (l.userData.base as number) + lidClose * 1.9;
    else blink(lids, t, 0.6);
  };
  return {
    group: root,
    name: spec.name,
    bones,
    animate,
    setPose: (p) => {
      if (p !== pose) {
        pose = p;
        poseSince = performance.now() / 1000;
      }
    },
  };
}

export { V };
