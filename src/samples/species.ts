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
  type EyeRig,
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
export type Gait = 'biped' | 'quadruped' | 'hover' | 'spider';
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
  /** A material of its own, when the part is not the body's surface (a mushroom cap). */
  surface?: SurfaceOpts;
  /** Extra colour bakes for this part only. */
  shades?: Shade[];
  /** Leave the shell fur off this part. */
  noFur?: boolean;
}

/** What `extras` get to hang hand-built decorations on. */
export interface RigContext {
  root: THREE.Group;
  hips: THREE.Group;
  bones: Record<string, THREE.Group>;
  meshes: Record<string, THREE.Mesh>;
  mat: THREE.MeshPhysicalMaterial;
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
  /** Which part carries the eyes and mouth; the head unless the face is on the body. */
  face?: 'head' | 'torso';
  /** Height above the ground a hovering species floats at. */
  hover?: number;
  /**
   * Decorations the format has no word for yet (dew, spores, a smoke shell, a trail),
   * built by hand onto the rig; may return a per-frame update.
   */
  extras?: (rig: RigContext) => ((t: number, pose: PoseName) => void) | void;
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
    /** Extra small eyes (a spider's row), glossy beads set in the skin. */
    extra?: Array<{ x: number; y: number; z: number; r: number }>;
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
    /** The closed shape: a smile line, a small round 'o', or a cat-like 'omega'. */
    shape?: 'smile' | 'o' | 'omega';
  };
  /** Per-pose face overrides: how far the lids close, the squint, the brow, the arc. */
  expressions?: Partial<Record<PoseName, Partial<Expression>>>;
  wings?: { x: number; y: number; z: number; size: number; color: string };
  /** The Chao emote ball, if the species has one. */
  ball?: { y: number; color: string };
  /** Hip height: the body bobs from here. */
  hipY: number;
  /** Radius of the contact shadow and the slope probe, in body units; from the torso box by default. */
  footprint?: number;
}

/** One face state: lids closed 0..1, lower-lid squint 0..1, brow tilt and lift, the happy arc. */
export interface Expression {
  lid: number;
  squint: number;
  /** Brow tilt in radians: positive raises the outer end (soft), negative knits it (focused). */
  brow: number;
  /** Brow lift in eye radii: up for surprise, down for sleep. */
  browLift: number;
  /** Draw the upturned lash arc once the lids are shut (a happy closed eye). */
  arc: boolean;
}

const EXPRESSIONS: Record<PoseName, Expression> = {
  idle: { lid: 0, squint: 0, brow: 0, browLift: 0, arc: false },
  happy: { lid: 1, squint: 0.3, brow: 0.3, browLift: 0.12, arc: true },
  walk: { lid: 0, squint: 0, brow: 0.05, browLift: 0, arc: false },
  eat: { lid: 0.1, squint: 0.45, brow: -0.3, browLift: -0.08, arc: false },
  sleep: { lid: 1, squint: 0, brow: -0.1, browLift: -0.12, arc: false },
};

export interface Rigged extends Creature {
  setPose(pose: PoseName): void;
  bones: Record<string, THREE.Group>;
  /** Set by the stage: ground height at a world x,z, so the body follows the slope. */
  ground?: (x: number, z: number) => number;
}

/** How far the body sinks below the sampled ground, in world units: feet a hair into the grass. */
const GROUND_SINK = 0.02;
/**
 * How far the contact shadow floats above the sampled ground, in world units. The
 * terrain mesh is a chord of its height function (up to 0.035 above it in a dip at the
 * stage's 0.5-unit spacing), so less than this z-fights or sinks between vertices.
 */
const BLOB_CLEARANCE = 0.05;
const BLOB_UPRIGHT = new THREE.Quaternion();

let blobTexture: THREE.CanvasTexture | null = null;
/** A soft radial shadow, painted once. */
function shadowBlob(): THREE.CanvasTexture {
  if (blobTexture) return blobTexture;
  const s = 128;
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, 'rgba(0,0,0,0.6)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.3)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s, s);
  blobTexture = new THREE.CanvasTexture(canvas);
  return blobTexture;
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
  const lipMat = new THREE.MeshPhysicalMaterial({ color: m.lip, roughness: 0.6 });
  // The closed shape: one smile arc, a small ring, or two cat arcs side by side.
  const lip = new THREE.Group();
  lip.position.set(0, w * 0.02, -w * 0.02);
  const shape = m.shape ?? 'smile';
  const arcs: Array<[number, number, number]> =
    shape === 'omega'
      ? [
          [-w * 0.25, w * 0.27, Math.PI],
          [w * 0.25, w * 0.27, Math.PI],
        ]
      : shape === 'o'
        ? [[0, w * 0.22, Math.PI * 2]]
        : [[0, w * 0.5, Math.PI]];
  for (const [ax, ar, len] of arcs) {
    const a = add(
      lip,
      new THREE.Mesh(new THREE.TorusGeometry(ar, w * 0.045, 8, 28, len), lipMat),
      ax,
      0,
      0,
    );
    a.rotation.z = Math.PI;
    a.castShadow = false;
  }
  g.add(lip);
  // The open mouth is drawn on the skin the way the reference does it: a dark rounded
  // opening under a straight upper lip, growing downward, with a tongue and teeth inside.
  const open = new THREE.Group();
  open.visible = false;
  g.add(open);
  const halfDisc = (
    radius: number,
    color: string,
    z: number,
    extra: Partial<THREE.MeshPhysicalMaterialParameters> = {},
  ) => {
    const mesh = add(
      open,
      new THREE.Mesh(
        new THREE.CircleGeometry(radius, 24, Math.PI, Math.PI),
        new THREE.MeshPhysicalMaterial({ color, roughness: 0.7, ...extra }),
      ),
      0,
      w * 0.02,
      z,
    );
    mesh.castShadow = false;
    return mesh;
  };
  const interior = halfDisc(w * 0.5, '#3a1424', 0.004);
  const rim = add(
    open,
    new THREE.Mesh(new THREE.TorusGeometry(w * 0.5, w * 0.045, 8, 28, Math.PI), lipMat),
    0,
    w * 0.02,
    0.004,
  );
  rim.rotation.z = Math.PI;
  rim.castShadow = false;
  const upper = add(
    open,
    new THREE.Mesh(new THREE.CapsuleGeometry(w * 0.045, w * 1.0, 3, 8), lipMat),
    0,
    w * 0.02,
    0.004,
  );
  upper.rotation.z = Math.PI / 2;
  upper.castShadow = false;
  const tongue = halfDisc(w * 0.3, m.tongue, 0.008, { roughness: 0.4, clearcoat: 0.5 });
  const teeth: THREE.Mesh[] = [];
  if (m.teeth) {
    for (const dx of [-0.32, 0.32]) {
      const t = add(
        open,
        new THREE.Mesh(
          new THREE.ConeGeometry(w * 0.055, w * 0.14, 3),
          new THREE.MeshPhysicalMaterial({ color: '#fbf6ea', roughness: 0.3 }),
        ),
        dx * w,
        w * 0.02 - w * 0.07,
        0.007,
      );
      t.rotation.z = Math.PI;
      t.castShadow = false;
      teeth.push(t);
    }
  }
  parent.add(g);
  return {
    group: g,
    open: (amount) => {
      const k = THREE.MathUtils.clamp(amount, 0, 1);
      // The closed shape gives way to the opening as the mouth opens.
      lip.visible = k < 0.2;
      open.visible = k >= 0.2;
      const h = 0.15 + k * 0.95;
      interior.scale.set(1, h, 1);
      rim.scale.set(1, h, 1);
      tongue.visible = k > 0.35;
      tongue.scale.set(1, Math.max(0.05, (k - 0.35) * 1.2), 1);
      tongue.position.y = w * 0.02 - w * 0.5 * h + w * 0.3 * tongue.scale.y;
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
  extra: Shade[] = [],
): THREE.BufferGeometry {
  const shades: Shade[] = [gradient(spec.shade.top, spec.shade.bottom, 0, spec.shade.yMax)];
  if (spec.marks.length) shades.push(markShade(spec.marks));
  if (spec.extraShades) shades.push(...spec.extraShades);
  shades.push(...extra);
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
  const meshes: Record<string, THREE.Mesh> = {};
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
  meshes.torso = torso;
  furred.push({ parent: hips, mesh: torso });

  const hang = (ps: PartSpec, parent: THREE.Group, parentOrigin: THREE.Vector3): THREE.Group => {
    const geo = sculptPart(
      spec,
      ps.prims,
      ps.box,
      ps.blend ?? spec.blend,
      ps.resolution ?? 80,
      ps.shades ?? [],
    );
    geo.translate(-ps.pivot.x, -ps.pivot.y, -ps.pivot.z);
    const mesh = new THREE.Mesh(geo, ps.surface ? surfaceMaterial(ps.surface) : mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const pivot = new THREE.Group();
    pivot.position.copy(ps.pivot).sub(parentOrigin);
    pivot.add(mesh);
    parent.add(pivot);
    bones[ps.name] = pivot;
    meshes[ps.name] = mesh;
    if (!ps.noFur) furred.push({ parent: pivot, mesh });
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

  // The face: eyes and the mouth hang from the head, or from the body when the face is
  // on the body (a mushroom with its cap for a head).
  const e = spec.eyes;
  const headOrigin = spec.head.pivot;
  const onBody = spec.face === 'torso';
  const facePart = onBody ? hips : head;
  const faceOrigin = onBody ? hipOrigin : headOrigin;
  const facePrims = onBody ? spec.torso.prims : spec.head.prims;
  const lids: THREE.Mesh[] = [];
  const eyes: EyeRig[] = [];
  const headBlend = (onBody ? spec.torso.blend : spec.head.blend) ?? spec.blend;
  const forward = new THREE.Vector3(0, 0, 1);
  for (const side of [-1, 1]) {
    // Each eye sits in the skin where the spec's point lands on the face, aimed along
    // the surface normal pulled a little toward straight ahead.
    const at = onSurface(facePrims, headBlend, V(side * e.x, e.y, e.z));
    const r = eye(
      facePart,
      0,
      0,
      0,
      e.r,
      e.iris,
      e.lidColor,
      0,
      e.lid,
      e.irisScale,
      0,
      e.tall ?? 1.2,
    );
    r.group.position.copy(at.pos).sub(faceOrigin);
    r.group.quaternion.setFromUnitVectors(
      forward,
      at.normal.addScaledVector(forward, 0.22).normalize(),
    );
    r.group.rotateY(side * e.yaw);
    r.group.rotateX(e.pitch ?? 0);
    lids.push(r.lid);
    r.brow.userData.side = side;
    eyes.push(r);
  }
  for (const x of e.extra ?? []) {
    const at = onSurface(facePrims, headBlend, V(x.x, x.y, x.z));
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(x.r, 16, 12),
      glossy(e.iris, { emissive: new THREE.Color(e.iris), emissiveIntensity: 0.5 }),
    );
    bead.position
      .copy(at.pos)
      .addScaledVector(at.normal, -x.r * 0.35)
      .sub(faceOrigin);
    bead.castShadow = false;
    facePart.add(bead);
  }
  const mouthAt = onSurface(facePrims, headBlend, V(spec.mouth.x, spec.mouth.y, spec.mouth.z));
  const mouth = buildMouth(facePart, {
    ...spec.mouth,
    x: mouthAt.pos.x - faceOrigin.x,
    y: mouthAt.pos.y - faceOrigin.y,
    z: mouthAt.pos.z - faceOrigin.z,
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

  // Extras (jaws, a ring, a trail) are part of the figure, so they hang before the feet
  // are measured.
  const extrasUpdate = spec.extras?.({ root, hips, bones, meshes, mat }) ?? null;

  // Where the feet are: the lowest point of the figure at rest. The specs put their
  // feet near y = 0 but not on it (Bolder's leg tips reach 0.2 below, Mossling stops
  // short), so the stage lifts the root by this much to set the soles on the ground.
  root.updateMatrixWorld(true);
  const corner = new THREE.Vector3();
  let footY = Infinity;
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const geo = o.geometry as THREE.BufferGeometry;
    if (!geo.boundingBox) geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    for (let i = 0; i < 8; i++) {
      corner.set(
        i & 1 ? bb.max.x : bb.min.x,
        i & 2 ? bb.max.y : bb.min.y,
        i & 4 ? bb.max.z : bb.min.z,
      );
      footY = Math.min(footY, corner.applyMatrix4(o.matrixWorld).y);
    }
  });
  if (!Number.isFinite(footY)) footY = 0;
  root.userData.footY = footY;
  // The contact points: the lowest rest vertex in each 0.3-unit cell of the ground plan
  // of every part that reaches near the ground (soles, leg tips, a sitter's belly). Each
  // frame the stage drops the root until the lowest of them touches the ground beneath
  // it, which a plane fit through four probes cannot do on ground that curves across the
  // footprint, and which one point per part misses under a wide belly.
  const cells = new Map<string, THREE.Vector3>();
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const p = (o.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      corner.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld);
      if (corner.y >= footY + 0.25) continue;
      const key = Math.floor(corner.x / 0.3) + ',' + Math.floor(corner.z / 0.3);
      const low = cells.get(key);
      if (!low || corner.y < low.y) cells.set(key, corner.clone());
    }
  });
  const contacts = [...cells.values()];
  const contact = new THREE.Vector3();

  // The contact shadow: a soft blob on the ground under the body. It lightens and
  // shrinks as the body lifts off (a hop, a hover).
  const footprint = spec.footprint ?? spec.torso.box[1].x * 0.85;
  const blobMat = new THREE.MeshBasicMaterial({
    map: shadowBlob(),
    transparent: true,
    depthWrite: false,
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  // The blob is a small grid rather than a card: the ground curves by several
  // centimetres across a footprint, so a flat card floats on one side and is cut off by
  // the terrain on the other. With a ground sampler the stage pins it flat in world space
  // and each vertex takes the height under it (see `animate`); without one it lies
  // under the feet.
  const blobGeo = new THREE.PlaneGeometry(footprint * 2.4, footprint * 2.4, 8, 8);
  blobGeo.rotateX(-Math.PI / 2);
  const blob = new THREE.Mesh(blobGeo, blobMat);
  blob.position.y = footY + BLOB_CLEARANCE / spec.scale;
  blob.renderOrder = 1;
  blob.frustumCulled = false;
  blob.updateMatrix();
  blob.matrixAutoUpdate = false;
  root.add(blob);
  const blobWorld = new THREE.Matrix4();
  const blobPos = new THREE.Vector3();
  const blobScale = new THREE.Vector3();

  root.scale.setScalar(spec.scale);
  root.userData.footprint = footprint * spec.scale;
  // Yaw first, then pitch and roll in the body's own frame: with the default XYZ order
  // the slope tilt would turn about the world axes and point the wrong way once the
  // creature is turned.
  root.rotation.order = 'YXZ';

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
  const spider = spec.gait === 'spider';
  const hover = spec.gait === 'hover';
  // Eight legs: leg1..leg4 on each side, leg1 at the front. Lifting is a turn about z
  // away from the body; swinging fore and aft is a turn about y.
  const SPIDER_LEGS: Array<[string, number, number]> = [];
  for (const side of [-1, 1])
    for (let i = 0; i < 4; i++)
      SPIDER_LEGS.push([
        'leg' + (i + 1) + (side < 0 ? 'L' : 'R'),
        side,
        (i + (side > 0 ? 0.5 : 0)) * 1.57,
      ]);
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
        if (spider) {
          for (const [n, side, phase] of SPIDER_LEGS) {
            // Lift only: the rest pose has the tips on the ground, so a dip would sink them.
            const k = Math.max(0, s(t * 1.6 + phase));
            set(n, 0, s(t * 1.1 + phase) * 0.05, side * (k * 0.07 + Math.max(0, k - 0.75) * 0.6));
          }
        } else if (quad) {
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
        if (spider) {
          for (const [n, side, phase] of SPIDER_LEGS)
            set(n, 0, s(t * 6 + phase) * 0.1, side * hop * 0.35);
        } else if (quad) {
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
        if (spider) {
          // Alternating tetrapod: legs 1 and 3 on one side step with 2 and 4 on the other.
          for (const [n, side, phase] of SPIDER_LEGS) {
            const swing = s(w + phase * 2);
            set(n, 0, swing * 0.3 * side, side * Math.max(0, swing) * 0.4);
          }
        } else if (quad) {
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
        if (spider) {
          for (const [n, side] of SPIDER_LEGS) set(n, 0, 0, n.startsWith('leg1') ? side * 0.5 : 0);
          hips.rotation.x = 0.1;
        } else if (quad) {
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
        if (spider) {
          for (const [n, side] of SPIDER_LEGS) set(n, 0, 0, -side * 0.3 * ease);
          hips.position.y = spec.hipY - 0.35 * ease;
        } else if (quad) {
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
    if (hover) {
      hips.position.y += (spec.hover ?? 0.5) + s(t * 1.4) * 0.18 * (pose === 'sleep' ? 0.3 : 1);
      hips.rotation.z += s(t * 0.9) * 0.06;
    }
    extrasUpdate?.(t, pose);
    // Grounding: the shadow follows the lift, and the body follows the slope under it.
    const lift = THREE.MathUtils.clamp(hips.position.y - spec.hipY, 0, 1.5);
    blobMat.opacity = 1 - lift * 0.7;
    const shrink = 1 - lift * 0.3;
    if (!rig.ground) {
      blob.scale.setScalar(shrink);
      blob.updateMatrix();
    } else {
      const yaw = root.rotation.y;
      const f = footprint * spec.scale;
      const fx = Math.sin(yaw) * f;
      const fz = Math.cos(yaw) * f;
      const rx = Math.cos(yaw) * f;
      const rz = -Math.sin(yaw) * f;
      const px = root.position.x;
      const pz = root.position.z;
      const hF = rig.ground(px + fx, pz + fz);
      const hB = rig.ground(px - fx, pz - fz);
      const hR = rig.ground(px + rx, pz + rz);
      const hL = rig.ground(px - rx, pz - rz);
      // Positive rotation.x drops the nose (local +z), so a higher front pitches it up
      // with the negative sign; positive rotation.z lifts the local +x side.
      root.rotation.x = -Math.atan2(hF - hB, 2 * f) * 0.85;
      root.rotation.z = Math.atan2(hR - hL, 2 * f) * 0.85;
      root.position.y = (hF + hB + hR + hL) / 4 - GROUND_SINK - footY * spec.scale;
      // Then the exact drop: the lowest contact point, carried by the root's yaw and tilt
      // alone (so a hop still leaves the ground), lands a hair into the grass.
      if (contacts.length) {
        root.updateMatrix();
        let worst = Infinity;
        for (const c of contacts) {
          contact.copy(c).applyMatrix4(root.matrix);
          worst = Math.min(worst, contact.y - rig.ground(contact.x, contact.z));
        }
        root.position.y -= worst + GROUND_SINK;
      }
      // The blob hugs the ground: its matrix is pinned flat in world space under the
      // root (whose parent is taken to be untransformed, as on the stage), and each
      // vertex takes the ground height under it.
      const bs = spec.scale * shrink;
      root.updateMatrix();
      blobWorld.compose(blobPos.set(px, 0, pz), BLOB_UPRIGHT, blobScale.setScalar(bs));
      blob.matrix.copy(root.matrix).invert().multiply(blobWorld);
      const bp = blobGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < bp.count; i++)
        bp.setY(i, (rig.ground(px + bp.getX(i) * bs, pz + bp.getZ(i) * bs) + BLOB_CLEARANCE) / bs);
      bp.needsUpdate = true;
    }
    mouth.open(mouthOpen);
    // The face: the pose's expression (with the species' overrides) eased in over a beat.
    const ex = { ...EXPRESSIONS[pose], ...(spec.expressions?.[pose] ?? {}) };
    const k = pose === 'sleep' ? Math.min(1, dt / 1.2) : Math.min(1, dt / 0.3);
    lidClose = Math.max(lidClose, ex.lid * k);
    if (lidClose > 0)
      for (const l of lids) l.rotation.x = (l.userData.base as number) + lidClose * 1.9;
    else blink(lids, t, 0.6);
    for (const e of eyes) {
      e.lower.rotation.x = (e.lower.userData.base as number) + ex.squint * k * 0.95;
      // A happy shut eye is the skin with a lash arc on it, not lids over a dome.
      const shut = ex.arc && lidClose > 0.8;
      e.arc.visible = shut;
      for (const p of e.ball) p.visible = !shut;
      const side = e.brow.userData.side as number;
      const r = e.brow.userData.r as number;
      e.brow.rotation.z = Math.PI / 2 + ex.brow * k * side;
      e.brow.position.y = (e.brow.userData.baseY as number) + ex.browLift * k * r;
    }
  };
  const rig: Rigged = {
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
  return rig;
}

export { V };
