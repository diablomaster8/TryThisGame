import * as THREE from 'three';
import {
  add,
  blink,
  breathe,
  combine,
  eye,
  furShells,
  glossy,
  gradient,
  surfaceMaterial,
  TOON,
  TOON_OUTLINE,
  toonMaterial,
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
export type PoseName = 'idle' | 'happy' | 'pet' | 'walk' | 'eat' | 'sleep' | 'carry' | 'throw';
/** The creature cycle on the stage. `carry` and `throw` are the Keeper's: see `KEEPER_POSES`. */
export const POSES: PoseName[] = ['idle', 'happy', 'pet', 'walk', 'eat', 'sleep'];
export const ALL_POSES: PoseName[] = [...POSES, 'carry', 'throw'];

/** A deliberate marking: a shape in body space, a colour, and how soft its edge is. */
export interface Mark {
  kind: 'ellipsoid' | 'sphere' | 'capsule';
  a: THREE.Vector3;
  b?: THREE.Vector3;
  r?: number;
  radii?: THREE.Vector3;
  color: string;
  /**
   * Edge width in body units (0.06 by default). `0` is a crisp edge: anti-aliased over one
   * vertex spacing of the sculpt, for face patches, socks and belly splits.
   */
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
  /**
   * A lower segment hung from this one at a joint: the shin under a knee. It is sculpted
   * on its own (put a ball at the knee in both so the join stays round as it bends) and
   * its bone sits under this part's bone. The walk plants the feet of parts named
   * `leg…` that have one.
   */
  joint?: {
    /** The knee, in body space. */
    pivot: THREE.Vector3;
    /** kneeL/kneeR, kneeFL/FR/BL/BR, knee1L..knee4R. */
    name: string;
    prims: Prim[];
    box: [THREE.Vector3, THREE.Vector3];
    blend?: number;
    resolution?: number;
  };
}

/** A jointed leg as the walk solves it: hip and knee bones, the rest chain, its stride phase. */
interface LegChain {
  hip: THREE.Group;
  knee: THREE.Group;
  /** Knee from hip at rest, in the hip's frame. */
  u: THREE.Vector3;
  /** Foot from knee at rest, in the knee's frame. */
  v: THREE.Vector3;
  /** The bend plane's normal: the knee turns about it. */
  n: THREE.Vector3;
  /** The foot at rest, in root space. */
  foot: THREE.Vector3;
  /** Where the last walk frame put the foot, in root space. */
  placed: THREE.Vector3;
  l1: number;
  l2: number;
  /** Angle between the two segments at rest. */
  theta0: number;
  /** Where in the stride this leg starts: 0 or 0.5. */
  phase: number;
}

/**
 * What a species' own pose (`poses` on the spec) gets to move each frame. The builder
 * has already put every bone back at rest; the pose adds to that, as the stock ones do.
 */
export interface PoseContext {
  /** Stage time in seconds, and the time since this pose began. */
  t: number;
  dt: number;
  /** Turn a bone from its rest rotation by x, y, z radians. Unknown names are ignored. */
  set(bone: string, x: number, y: number, z: number): void;
  /** Bend a jointed leg's knee (by its hip bone name) in its natural direction. */
  bend(leg: string, angle: number): void;
  hips: THREE.Group;
  head: THREE.Group;
  /** The head bone's rest position: slide the head by adding to `head.position`. */
  headRest: THREE.Vector3;
  /** `lookAt` as a head yaw and pitch in hip space, with its ease-in `k` (0 when nothing is looked at). */
  look: { yaw: number; pitch: number; k: number };
  /** How far the mouth opens, 0..1. */
  mouth(open: number): void;
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
    /** `false` leaves the brow ridge off (the line-up's figures have none). */
    brow?: boolean;
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
    /** The toon mode's line colour for this mouth (a painted red 'o'); the outline colour by default. */
    line?: string;
  };
  /** Per-pose face overrides: how far the lids close, the squint, the brow, the arc. */
  expressions?: Partial<Record<PoseName, Partial<Expression>>>;
  /**
   * A species' own poses, replacing the stock one of the same name: the Keeper reaches
   * out for `pet` where a creature leans in, and is the only one with `carry` and `throw`.
   */
  poses?: Partial<Record<PoseName, (c: PoseContext) => void>>;
  /** Whether hearts rise while petted; off for the one doing the petting. */
  hearts?: boolean;
  /** Translucent wings: the fairy pair by default, a feathered lobe or a scalloped bat wing. */
  wings?: {
    x: number;
    y: number;
    z: number;
    size: number;
    color: string;
    shape?: 'fairy' | 'feather' | 'bat';
  };
  /**
   * The Chao emote ball, if the species has one: a plain ball, a flat halo ring or a
   * spiked ball; `glow` tints its emissive and its light (warm gold by default).
   */
  ball?: { y: number; color: string; shape?: 'ball' | 'halo' | 'spikes'; glow?: string };
  /** Hip height: the body bobs from here. */
  hipY: number;
  /**
   * The walk's step: `length` scales how far the body advances per cycle (1 is one leg
   * length, the default; for unjointed legs it widens the hip swing), `period` is the
   * cycle in seconds (0.8 by default), `duty` the share of it a jointed foot is planted
   * (0.6). Longer steps let a short-legged figure keep up with the sim at a sane cadence;
   * jointed hips crouch as far as the extremes need, and a lower duty needs less.
   */
  stride?: { length?: number; period?: number; duty?: number };
  /** Radius of the contact shadow and the slope probe, in body units; from the torso box by default. */
  footprint?: number;
  /** Which reference frame or pass the species was last tuned against, for the next pass. */
  notes?: string;
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
  pet: { lid: 1, squint: 0.35, brow: 0.35, browLift: 0.1, arc: true },
  walk: { lid: 0, squint: 0, brow: 0.05, browLift: 0, arc: false },
  eat: { lid: 0.1, squint: 0.45, brow: -0.3, browLift: -0.08, arc: false },
  sleep: { lid: 1, squint: 0, brow: -0.1, browLift: -0.12, arc: false },
  carry: { lid: 0.15, squint: 0.2, brow: 0.2, browLift: 0.04, arc: false },
  throw: { lid: 0, squint: 0.3, brow: -0.25, browLift: 0.06, arc: false },
};

export interface Rigged extends Creature {
  setPose(pose: PoseName): void;
  bones: Record<string, THREE.Group>;
  /** Set by the stage: ground height at a world x,z, so the body follows the slope. */
  ground?: (x: number, z: number) => number;
  /**
   * Set by the stage: a world point the creature attends to (the Keeper's hand). The
   * `pet` pose turns and leans the head toward it; null looks straight ahead.
   */
  lookAt: THREE.Vector3 | null;
  /** Turn to face a world yaw: eased over 0.4 s with a lean into the turn, not a snap. */
  face(yaw: number): void;
  /**
   * How far the body advances per walk cycle, in the rig's own units (times
   * `group.scale` for world units), and how long a cycle takes in seconds: move the root
   * by `strideLength * group.scale.x / stridePeriod` per second while the pose is `walk`
   * and the planted feet stay where they touched down.
   */
  strideLength: number;
  stridePeriod: number;
}

/** Hearts over a petted head, and how long each one rises for. */
const HEART_COUNT = 7;
const HEART_LIFE = 1.6;
/** Seconds between Zzz puffs while asleep. */
const Z_EVERY = 3.2;
/** Seconds a turn in place takes. */
const TURN_TIME = 0.4;
/** Breathing: 0.25 Hz as radians per second. */
const BREATH_RATE = Math.PI * 2 * 0.25;
/** How far the head may turn and tilt toward the look point, radians. */
const LOOK_YAW = 0.7;
/** Furthest an iris slides from centre, as a fraction of the eye radius. */
const IRIS_TRAVEL = 0.22;
/** Eased rate (per second) at which the irises follow their target. */
const IRIS_EASE = 6;
const LOOK_PITCH = 0.4;

const smooth = (k: number) => k * k * (3 - 2 * k);

/** A tiny seeded generator for render-side jitter (ear flicks), keyed by a name. */
function seeded(name: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) h = Math.imul(h ^ name.charCodeAt(i), 16777619);
  let x = h >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 4294967296;
  };
}

let heartTex: THREE.CanvasTexture | null = null;
/** A soft painted heart: pink fill, white rim, a highlight, a glow round it. */
function heartTexture(): THREE.CanvasTexture {
  if (heartTex) return heartTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const heart = (x: number, y: number, r: number) => {
    g.beginPath();
    g.moveTo(x, y + r * 0.95);
    g.bezierCurveTo(x - r * 1.15, y + r * 0.2, x - r * 0.95, y - r * 0.9, x, y - r * 0.35);
    g.bezierCurveTo(x + r * 0.95, y - r * 0.9, x + r * 1.15, y + r * 0.2, x, y + r * 0.95);
    g.closePath();
  };
  const glow = g.createRadialGradient(32, 32, 4, 32, 32, 31);
  glow.addColorStop(0, 'rgba(255,150,200,0.5)');
  glow.addColorStop(1, 'rgba(255,150,200,0)');
  g.fillStyle = glow;
  g.fillRect(0, 0, 64, 64);
  heart(32, 31, 19);
  g.fillStyle = '#ff7fb4';
  g.fill();
  g.lineWidth = 2.5;
  g.strokeStyle = 'rgba(255,255,255,0.9)';
  g.stroke();
  g.beginPath();
  g.ellipse(25, 23, 4, 2.6, -0.6, 0, Math.PI * 2);
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.fill();
  heartTex = new THREE.CanvasTexture(c);
  heartTex.colorSpace = THREE.SRGBColorSpace;
  return heartTex;
}

let zTex: THREE.CanvasTexture | null = null;
/** A painted Z glyph for the sleeping Zzz: pale blue with a white edge and a soft halo. */
function zTexture(): THREE.CanvasTexture {
  if (zTex) return zTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.font = 'bold 44px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = 'rgba(200,225,255,0.9)';
  g.shadowBlur = 8;
  g.lineWidth = 6;
  g.lineJoin = 'round';
  g.strokeStyle = 'rgba(255,255,255,0.95)';
  g.strokeText('Z', 32, 34);
  g.shadowBlur = 0;
  g.fillStyle = '#b8d8ff';
  g.fillText('Z', 32, 34);
  zTex = new THREE.CanvasTexture(c);
  zTex.colorSpace = THREE.SRGBColorSpace;
  return zTex;
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

/**
 * Bake the marks into the vertex colours. `cell` is the sculpt's vertex spacing: a mark
 * with `soft: 0` ramps over one cell centred on its edge, the narrowest edge that still
 * reads without stair-steps.
 */
function markShade(marks: Mark[], cell: number): Shade {
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
      if (soft > 0) {
        if (d < soft) c.lerp(colors[i]!, THREE.MathUtils.clamp(1 - d / soft, 0, 1));
      } else if (d < cell * 0.5) {
        c.lerp(colors[i]!, THREE.MathUtils.clamp(0.5 - d / cell, 0, 1));
      }
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
    for (const q of prims) d = smin(d, sdf(p, q), q.blend ?? blend);
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
  // The toon mode draws the mouth as one solid dark line, as the line-up does.
  const lipMat = new THREE.MeshPhysicalMaterial({
    color: TOON.on ? (m.line ?? TOON_OUTLINE.color) : m.lip,
    roughness: 0.6,
  });
  if (TOON.on) toonMaterial(lipMat);
  const lipR = w * (TOON.on ? 0.1 : 0.045);
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
      new THREE.Mesh(new THREE.TorusGeometry(ar, lipR, 8, 28, len), lipMat),
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
  if (spec.marks.length) {
    // The same spacing `sculpt` uses: the box's longest side, padded 8%, over the grid.
    const size = box[1].clone().sub(box[0]);
    const cell = (Math.max(size.x, size.y, size.z) * 1.08) / res;
    shades.push(markShade(spec.marks, cell));
  }
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

/** One surface `buildSpecies` sculpts: the torso, a part or a part's lower segment. */
export interface Surface {
  prims: Prim[];
  box: [THREE.Vector3, THREE.Vector3];
  blend: number;
  res: number;
  extra: Shade[];
}

const torsoSurface = (spec: SpeciesSpec): Surface => ({
  prims: spec.torso.prims,
  box: spec.torso.box,
  blend: spec.torso.blend ?? spec.blend,
  res: spec.torso.resolution ?? 104,
  extra: [],
});
const partSurface = (spec: SpeciesSpec, ps: PartSpec): Surface => ({
  prims: ps.prims,
  box: ps.box,
  blend: ps.blend ?? spec.blend,
  res: ps.resolution ?? 80,
  extra: ps.shades ?? [],
});
const jointSurface = (spec: SpeciesSpec, ps: PartSpec): Surface => {
  const j = ps.joint!;
  return {
    prims: j.prims,
    box: j.box,
    blend: j.blend ?? ps.blend ?? spec.blend,
    res: j.resolution ?? ps.resolution ?? 80,
    extra: ps.shades ?? [],
  };
};

/**
 * Every surface `buildSpecies` sculpts, in the order it sculpts them, so the marching
 * can run elsewhere (a worker) and the build take the results.
 */
export function speciesSurfaces(spec: SpeciesSpec): Surface[] {
  const out = [torsoSurface(spec)];
  for (const ps of [spec.head, ...spec.parts]) {
    out.push(partSurface(spec, ps));
    if (ps.joint) out.push(jointSurface(spec, ps));
  }
  return out;
}

/** March one surface of a species: the slow part of a build. */
export function sculptSurface(spec: SpeciesSpec, s: Surface): THREE.BufferGeometry {
  return sculptPart(spec, s.prims, s.box, s.blend, s.res, s.extra);
}

/**
 * Build a rigged figure. `sculpted`, when given, holds the surfaces already marched in
 * `speciesSurfaces` order (from a worker or a cache) and the build skips the marching.
 */
export function buildSpecies(spec: SpeciesSpec, sculpted?: THREE.BufferGeometry[]): Rigged {
  let next = 0;
  const surface = (s: Surface): THREE.BufferGeometry =>
    sculpted ? sculpted[next++]! : sculptSurface(spec, s);
  const root = new THREE.Group();
  const mat = surfaceMaterial(spec.surface);
  const bones: Record<string, THREE.Group> = {};
  const meshes: Record<string, THREE.Mesh> = {};
  const furred: Array<{ parent: THREE.Object3D; mesh: THREE.Mesh }> = [];
  const legs: LegChain[] = [];

  // Hips carry the torso; everything else hangs from the torso or the hips.
  const hips = new THREE.Group();
  hips.position.set(0, spec.hipY, 0);
  root.add(hips);
  bones.hips = hips;
  const torsoGeo = surface(torsoSurface(spec));
  torsoGeo.translate(0, -spec.hipY, 0);
  const torso = new THREE.Mesh(torsoGeo, mat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  // The chest group carries the torso and its fur alone, so breathing scales the body
  // without moving the head or lifting the feet.
  const chest = new THREE.Group();
  chest.add(torso);
  hips.add(chest);
  bones.torso = hips;
  meshes.torso = torso;
  furred.push({ parent: chest, mesh: torso });
  torsoGeo.computeBoundingBox();
  // Where the belly is at rest, in root space: a sleeping body lies down to here.
  const bellyY = torsoGeo.boundingBox!.min.y + spec.hipY;

  const hang = (ps: PartSpec, parent: THREE.Group, parentOrigin: THREE.Vector3): THREE.Group => {
    const geo = surface(partSurface(spec, ps));
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
    if (ps.joint) {
      // The lower segment hangs from the knee, which hangs from this part's bone.
      const j = ps.joint;
      const lowGeo = surface(jointSurface(spec, ps));
      lowGeo.translate(-j.pivot.x, -j.pivot.y, -j.pivot.z);
      const low = new THREE.Mesh(lowGeo, mesh.material);
      low.castShadow = true;
      low.receiveShadow = true;
      const knee = new THREE.Group();
      knee.position.copy(j.pivot).sub(ps.pivot);
      knee.add(low);
      pivot.add(knee);
      bones[j.name] = knee;
      meshes[j.name] = low;
      if (!ps.noFur) furred.push({ parent: knee, mesh: low });
      if (ps.name.startsWith('leg')) {
        // The foot is the lowest point of the lower segment. Straight legs (no bend at
        // rest) take the knee forward, as a standing animal's does.
        const lp = lowGeo.attributes.position as THREE.BufferAttribute;
        const v = new THREE.Vector3(0, Infinity, 0);
        for (let i = 0; i < lp.count; i++) if (lp.getY(i) < v.y) v.fromBufferAttribute(lp, i);
        const u = knee.position.clone();
        const n = new THREE.Vector3().crossVectors(u, v);
        if (n.lengthSq() < 1e-6) n.set(1, 0, 0);
        n.normalize();
        const foot = ps.pivot.clone().add(u).add(v);
        legs.push({
          hip: pivot,
          knee,
          u,
          v,
          n,
          foot,
          placed: foot.clone(),
          l1: u.length(),
          l2: v.length(),
          theta0: u.angleTo(v),
          phase: /^leg(L|FL|BR|1L|3L|2R|4R)$/.test(ps.name) ? 0 : 0.5,
        });
      }
    }
    return pivot;
  };
  const hipOrigin = new THREE.Vector3(0, spec.hipY, 0);
  const head = hang(spec.head, hips, hipOrigin);
  for (const ps of spec.parts) hang(ps, hips, hipOrigin);
  if (sculpted && next !== sculpted.length)
    throw new Error(`${spec.name}: ${sculpted.length} surfaces given, ${next} used`);

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
    if (e.brow === false) r.brow.visible = false;
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
      const k = w.size;
      shape.moveTo(0, 0);
      if (w.shape === 'feather') {
        // A rounded angel lobe with two soft scallops on the trailing edge.
        shape.quadraticCurveTo(0.7 * dx * k, 0.35 * k, 0.55 * dx * k, 1.05 * k);
        shape.quadraticCurveTo(0.35 * dx * k, 0.75 * k, 0.22 * dx * k, 0.95 * k);
        shape.quadraticCurveTo(0.08 * dx * k, 0.6 * k, -0.1 * dx * k, 0.55 * k);
        shape.quadraticCurveTo(-0.1 * dx * k, 0.2 * k, 0, 0);
      } else if (w.shape === 'bat') {
        // Two fingers with a scalloped membrane between them.
        shape.lineTo(0.75 * dx * k, 0.9 * k);
        shape.quadraticCurveTo(0.45 * dx * k, 0.45 * k, 0.4 * dx * k, 0.15 * k);
        shape.quadraticCurveTo(0.2 * dx * k, 0.35 * k, 0.08 * dx * k, 0.05 * k);
        shape.lineTo(0, 0);
      } else {
        shape.quadraticCurveTo(0.46 * dx * k, 0.5 * k, 0.16 * dx * k, 1.0 * k);
        shape.quadraticCurveTo(-0.18 * dx * k, 0.55 * k, 0, 0);
      }
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
  let ball: THREE.Object3D | null = null;
  let ballMat: THREE.MeshPhysicalMaterial | null = null;
  if (spec.ball) {
    const glow = new THREE.Color(spec.ball.glow ?? '#9a7010');
    ballMat = glossy(spec.ball.color, { emissive: glow, emissiveIntensity: 1.4 });
    if (spec.ball.shape === 'halo') {
      // A flat ring, lying level over the crown.
      ball = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 12, 36), ballMat);
      ball.rotation.x = Math.PI / 2;
    } else if (spec.ball.shape === 'spikes') {
      // A smaller ball with eight short spikes around it.
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 18), ballMat));
      const spike = new THREE.ConeGeometry(0.045, 0.14, 8);
      spike.translate(0, 0.19, 0);
      const dirs = [V(0, 1, 0), V(0, -1, 0), V(1, 0, 0), V(-1, 0, 0), V(0, 0, 1), V(0, 0, -1)];
      dirs.push(V(0.7, 0.7, 0), V(-0.7, 0.7, 0));
      for (const d of dirs) {
        const m = new THREE.Mesh(spike, ballMat);
        m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
        g.add(m);
      }
      ball = g;
    } else {
      ball = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 18), ballMat);
    }
    ball.position.set(0, spec.ball.y - headOrigin.y, 0);
    head.add(ball);
    // The light takes the glow tint, lifted toward white so it still reads as a lamp.
    const light = new THREE.PointLight(
      glow.clone().lerp(new THREE.Color('#ffffff'), 0.55),
      1.2,
      2.5,
      1.6,
    );
    light.position.copy(ball.position);
    head.add(light);
  }

  // Hearts for the pet pose and the Zzz for sleep: painted sprites hung over the head.
  // The crown and the head's half-width, in head space: ears and crown points are
  // part of the head mesh, so the crown is capped a head-radius above the eyes.
  const headGeo = meshes.head!.geometry;
  headGeo.computeBoundingBox();
  const hb = headGeo.boundingBox!;
  const headR = Math.max(0.1, (hb.max.x - hb.min.x) / 2);
  const crownY = onBody ? hb.max.y : Math.min(hb.max.y, e.y - headOrigin.y + headR * 1.1);
  const hearts: THREE.Sprite[] = [];
  const zs: THREE.Sprite[] = [];
  for (let i = 0; i < HEART_COUNT + 3; i++) {
    const heart = i < HEART_COUNT;
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: heart ? heartTexture() : zTexture(),
        transparent: true,
        depthWrite: false,
      }),
    );
    sp.visible = false;
    sp.renderOrder = 2;
    head.add(sp);
    (heart ? hearts : zs).push(sp);
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
  let now = 0;
  let lastFrame = 0;
  const headRest = head.position.clone();
  // Turning in place: once `face` has been called the root eases from yawFrom to yawTo.
  let faced = false;
  let yawFrom = 0;
  let yawTo = 0;
  let turnAt = -10;
  // Ear flicks at irregular intervals, seeded by the species name so each creature has
  // its own rhythm. Render code: the sim's no-Math.random rule does not reach here, but
  // a seed keeps a line-up from flicking in step.
  const flickRng = seeded(spec.name);
  let nextFlick = 1 + flickRng() * 4;
  let flickAt = -10;
  let flickSide = 1;
  // The look point in hip space, as a yaw and pitch for the head, eased in and out.
  const look = new THREE.Vector3();
  const gaze = new THREE.Vector3();
  let lookYaw = 0;
  let lookPitch = 0;
  let lookK = 0;
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
  // The walk. The body advances `stride.length` per `stride.period`; a foot is planted
  // for the `duty` share of the cycle, sliding back under the body at exactly that
  // speed, then swings forward on an arc of height `lift`. Two bones per leg are solved
  // so the foot lands where asked; the hips crouch just enough that the extremes of the
  // step stay within reach of a straightened leg.
  const legLen = legs.reduce((m, l) => Math.max(m, l.l1 + l.l2), 0) || spec.hipY * 0.6;
  const stepScale = spec.stride?.length ?? 1;
  // Unjointed legs swing from the hip instead. At the bottom of the swing the foot moves
  // at r·legSwing·2π per cycle (r the hip's height over the foot), so that is the stride.
  const swingLegs =
    legs.length || spider || hover ? [] : spec.parts.filter((p) => p.name.startsWith('leg'));
  const legSwing = Math.min(1, 0.55 * stepScale);
  const swingR = swingLegs.reduce((m, p) => m + p.pivot.y - footY, 0) / (swingLegs.length || 1);
  const stride = {
    length: swingLegs.length
      ? 2 * Math.PI * swingR * legSwing
      : legLen * (spider ? 0.25 : 1) * stepScale,
    period: spec.stride?.period ?? (spider ? 0.7 : 0.8),
    lift: legLen * (spider ? 0.08 : 0.25),
    duty: spec.stride?.duty ?? (spider ? 0.5 : 0.6),
  };
  const WALK_BOB = 0.03;
  let crouch = 0;
  {
    const half = (stride.length * stride.duty) / 2;
    const d = new THREE.Vector3();
    for (const leg of legs) {
      const reach = (leg.l1 + leg.l2) * 0.985;
      let c = 0;
      while (c < legLen * 0.5) {
        d.copy(leg.u)
          .add(leg.v)
          .add(new THREE.Vector3(0, c - WALK_BOB, half));
        if (d.length() <= reach) break;
        c += 0.005;
      }
      crouch = Math.max(crouch, c);
    }
  }
  const hipsInv = new THREE.Matrix4();
  const footTarget = new THREE.Vector3();
  const dVec = new THREE.Vector3();
  const vBent = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const qKnee = new THREE.Quaternion();
  /** Put a leg's foot at a root-space point: bend the knee for the distance, swing the hip to aim. */
  const solveLeg = (leg: LegChain, target: THREE.Vector3) => {
    dVec.copy(target).applyMatrix4(hipsInv).sub(leg.hip.position);
    if (dVec.lengthSq() < 1e-8) return;
    const reach = (leg.l1 + leg.l2) * 0.995;
    const dist = THREE.MathUtils.clamp(dVec.length(), Math.abs(leg.l1 - leg.l2) + 1e-3, reach);
    const cosB = (leg.l1 * leg.l1 + leg.l2 * leg.l2 - dist * dist) / (2 * leg.l1 * leg.l2);
    const theta = Math.PI - Math.acos(THREE.MathUtils.clamp(cosB, -1, 1));
    qKnee.setFromAxisAngle(leg.n, theta - leg.theta0);
    leg.knee.quaternion.copy(qKnee);
    vBent.copy(leg.v).applyQuaternion(qKnee);
    e1.copy(leg.u).add(vBent).normalize();
    dVec.normalize();
    leg.hip.quaternion.setFromUnitVectors(e1, dVec);
    leg.placed.copy(dVec).multiplyScalar(dist).add(leg.hip.position).applyMatrix4(hips.matrix);
  };
  /** Bend a jointed leg's knee by an angle in its natural direction (as solveLeg does). */
  const bendKnee = (leg: LegChain, angle: number) => {
    leg.knee.quaternion.setFromAxisAngle(leg.n, angle);
  };
  // What a species' own pose works with; filled in per frame.
  let ownMouth = 0;
  const poseCtx: PoseContext = {
    t: 0,
    dt: 0,
    set,
    bend: (name, angle) => {
      const leg = legs.find((l) => l.hip === bones[name]);
      if (leg) bendKnee(leg, angle);
    },
    hips,
    head,
    headRest,
    look: { yaw: 0, pitch: 0, k: 0 },
    mouth: (open) => {
      ownMouth = open;
    },
  };
  const animate = (t: number) => {
    const fdt = Math.min(0.1, Math.max(0, t - lastFrame));
    lastFrame = t;
    now = t;
    const dt = t - poseSince;
    const s = Math.sin;
    hips.position.y = spec.hipY;
    hips.rotation.set(0, 0, 0);
    hips.scale.set(1, 1, 1);
    head.position.copy(headRest);
    head.scale.set(1, 1, 1);
    for (const leg of legs) leg.knee.rotation.set(0, 0, 0);
    let lidClose = 0;
    let mouthOpen = 0;
    if (rig.lookAt && pose === 'pet') {
      look.copy(rig.lookAt);
      hips.worldToLocal(look).sub(headRest);
      lookYaw = THREE.MathUtils.clamp(Math.atan2(look.x, look.z), -LOOK_YAW, LOOK_YAW);
      const flat = Math.hypot(look.x, look.z);
      lookPitch = THREE.MathUtils.clamp(-Math.atan2(look.y, flat), -LOOK_PITCH, LOOK_PITCH);
      lookK = Math.min(1, lookK + fdt / 0.35);
    } else lookK = Math.max(0, lookK - fdt / 0.35);
    const own = spec.poses?.[pose];
    if (own) {
      poseCtx.t = t;
      poseCtx.dt = dt;
      poseCtx.look.yaw = lookYaw;
      poseCtx.look.pitch = lookPitch;
      poseCtx.look.k = lookK;
      own(poseCtx);
      mouthOpen = ownMouth;
    }
    switch (own ? null : pose) {
      case null:
        break;
      // A species without its own `carry` and `throw` just stands.
      case 'carry':
      case 'throw':
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
        // Squash and stretch: long at the top of the hop, flat on the landing, with the
        // hips moved by the scale so the feet stay on the ground.
        const sq = (hop * 2 - 1) * 0.06;
        hips.scale.set(1 - sq, 1 + sq, 1 - sq);
        hips.position.y = spec.hipY + hop * 0.22 + (spec.hipY - footY) * sq;
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
          set('tail', 0.85, s(t * 7) * 0.7, 0);
        } else {
          set('tail', 0.85, s(t * 7) * 0.7, 0);
          set('armL', 0, 0, 1.3 + s(t * 7) * 0.35);
          set('armR', 0, 0, -1.3 - s(t * 7 + 1) * 0.35);
          set('legL', -0.3 * hop, 0, 0);
          set('legR', -0.3 * hop, 0, 0);
        }
        mouthOpen = 0.75;
        break;
      }
      case 'pet': {
        // The signature moment: turn to the Keeper, lean the head into the hand, shut
        // the eyes into arcs, wag, and let the hearts rise.
        const ease = smooth(Math.min(1, dt / 0.5));
        const nuzzle = s(t * 2.6) * 0.06;
        hips.position.y = spec.hipY + s(t * 2.2) * 0.02;
        hips.rotation.z = s(t * 1.3) * 0.03;
        hips.rotation.x = -0.04 * ease;
        set(
          'head',
          lookPitch * lookK + (0.12 + nuzzle) * ease,
          lookYaw * lookK,
          s(t * 1.7) * 0.08 + 0.16 * ease,
        );
        // Lean in: the head slides toward the hand.
        head.position.x += Math.sin(lookYaw * lookK) * 0.08 * ease;
        head.position.z += Math.cos(lookYaw * lookK) * 0.08 * ease;
        head.position.y += nuzzle * 0.5;
        set('tail', 0.55, s(t * 12) * 0.8, 0);
        if (spider) {
          for (const [n, side, phase] of SPIDER_LEGS)
            set(n, 0, s(t * 2 + phase) * 0.04, side * 0.03 * ease);
        } else if (quad) {
          set('legFL', -0.1 * ease, 0, 0);
          set('legFR', -0.1 * ease, 0, 0);
          set('legBL', 0, 0, 0);
          set('legBR', 0, 0, 0);
        } else {
          set('armL', -0.3 * ease, 0, 0.5 * ease + s(t * 3) * 0.08);
          set('armR', -0.3 * ease, 0, -0.5 * ease - s(t * 3 + 1) * 0.08);
          set('legL', 0, 0, 0);
          set('legR', 0, 0, 0);
        }
        mouthOpen = 0.3;
        break;
      }
      case 'walk': {
        const cycle = t / stride.period;
        const w = cycle * Math.PI * 2;
        hips.position.y = spec.hipY - crouch + Math.abs(s(w)) * WALK_BOB;
        hips.rotation.x = -0.06;
        hips.rotation.z = s(w) * 0.03;
        set('head', s(w * 2) * 0.03, 0, 0);
        if (legs.length) {
          hips.updateMatrix();
          hipsInv.copy(hips.matrix).invert();
          const half = (stride.length * stride.duty) / 2;
          for (const leg of legs) {
            const ph = (cycle + leg.phase) % 1;
            let dz: number;
            let dy = 0;
            if (ph < stride.duty) {
              dz = half - (ph / stride.duty) * 2 * half;
            } else {
              const p = (ph - stride.duty) / (1 - stride.duty);
              dz = -half + p * p * (3 - 2 * p) * 2 * half;
              dy = stride.lift * s(p * Math.PI);
            }
            footTarget.copy(leg.foot);
            footTarget.y += dy;
            footTarget.z += dz;
            solveLeg(leg, footTarget);
          }
          if (quad) set('tail', 0.15, s(w * 0.5) * 0.3, 0);
          else if (!spider) {
            set('armL', -s(w) * 0.4, 0, 0.15);
            set('armR', s(w) * 0.4, 0, -0.15);
          }
        } else if (spider) {
          // Alternating tetrapod: legs 1 and 3 on one side step with 2 and 4 on the other.
          for (const [n, side, phase] of SPIDER_LEGS) {
            const swing = s(w + phase * 2);
            set(n, 0, swing * 0.3 * side, side * Math.max(0, swing) * 0.4);
          }
        } else if (quad) {
          set('legFL', s(w) * legSwing, 0, 0);
          set('legBR', s(w) * legSwing, 0, 0);
          set('legFR', -s(w) * legSwing, 0, 0);
          set('legBL', -s(w) * legSwing, 0, 0);
          set('tail', 0.15, s(w * 0.5) * 0.3, 0);
        } else {
          set('legL', s(w) * legSwing, 0, 0);
          set('legR', -s(w) * legSwing, 0, 0);
          set('armL', -s(w) * 0.4, 0, 0.15);
          set('armR', s(w) * 0.4, 0, -0.15);
        }
        mouthOpen = 0.1;
        break;
      }
      case 'eat': {
        const chomp = Math.max(0, s(t * 5));
        set('head', 0.42 + chomp * 0.08, 0, s(t * 0.9) * 0.05);
        // The chomp stretches the head forward and thins it a little, volume kept.
        head.scale.set(1 - chomp * 0.035, 1 - chomp * 0.035, 1 + chomp * 0.08);
        head.position.z += chomp * 0.03;
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
        const ease = smooth(Math.min(1, dt / 1.2));
        // Lie down fully: the belly comes to the grass and the legs fold under it
        // (knees bent where there are knees); bipeds curl forward over their knees.
        const lie = Math.max(0, bellyY - footY - 0.03);
        set('head', (quad ? 0.45 : 0.6) * ease, 0, 0.12 * ease);
        if (spider) {
          for (const [n, side] of SPIDER_LEGS) set(n, 0, 0, -side * 0.3 * ease);
          for (const leg of legs) bendKnee(leg, 0.9 * ease);
          hips.position.y = spec.hipY - 0.35 * ease;
        } else if (quad) {
          hips.position.y = spec.hipY - lie * ease;
          hips.rotation.x = 0.05 * ease;
          for (const n of ['legFL', 'legFR']) set(n, -1.0 * ease, 0, 0);
          for (const n of ['legBL', 'legBR']) set(n, 1.1 * ease, 0, 0);
          for (const leg of legs) bendKnee(leg, 1.7 * ease);
          set('tail', 0.6 * ease, 0.9 * ease, 0);
        } else if (hover) {
          hips.rotation.x = 0.22 * ease;
          set('armL', -0.3 * ease, 0, 0.3 * ease);
          set('armR', -0.3 * ease, 0, -0.3 * ease);
        } else {
          hips.position.y = spec.hipY - Math.min(lie, spec.hipY * 0.55) * ease;
          hips.rotation.x = 0.35 * ease;
          set('legL', -1.3 * ease, 0, 0.15 * ease);
          set('legR', -1.3 * ease, 0, -0.15 * ease);
          for (const leg of legs) bendKnee(leg, 1.6 * ease);
          set('armL', -0.5 * ease, 0, 0.35 * ease);
          set('armR', -0.5 * ease, 0, -0.35 * ease);
        }
        lidClose = ease;
        mouthOpen = 0.08;
        break;
      }
    }
    // Ears, wings, the ball and the blink run on top of every pose.
    // Ear flicks: one ear snaps out and back over a quarter second at irregular
    // intervals; a petted creature folds its ears back a little, a sleeping one more.
    if (t > nextFlick) {
      flickAt = t;
      flickSide = flickRng() < 0.5 ? -1 : 1;
      nextFlick = t + 2 + flickRng() * 5;
    }
    const flick = t - flickAt < 0.25 ? s(((t - flickAt) / 0.25) * Math.PI) * 0.5 : 0;
    const earFold = pose === 'sleep' ? 0.3 : pose === 'pet' ? 0.18 : 0;
    set('earL', 0, 0, s(t * 3.1) * 0.08 - earFold - (flickSide < 0 ? flick : 0));
    set('earR', 0, 0, -s(t * 3.1 + 2) * 0.08 + earFold + (flickSide > 0 ? flick : 0));
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
      hips.position.y +=
        (spec.hover ?? 0.5) * (pose === 'sleep' ? 0.55 : 1) +
        s(t * 1.4) * 0.18 * (pose === 'sleep' ? 0.3 : 1);
      hips.rotation.z += s(t * 0.9) * 0.06;
    }
    // Breathing under every pose: a slow chest scale, slower and deeper asleep.
    breathe(chest, 1, t, pose === 'sleep' ? 0.9 : BREATH_RATE, pose === 'sleep' ? 0.022 : 0.015);
    // Turning in place: the yaw eases over TURN_TIME, the body leaning into the turn
    // and lagging it a touch.
    if (faced) {
      const k = Math.min(1, (t - turnAt) / TURN_TIME);
      const delta = yawTo - yawFrom;
      root.rotation.y = yawFrom + delta * smooth(k);
      if (k < 1) {
        const w = s(k * Math.PI);
        hips.rotation.z += w * Math.sign(delta) * Math.min(0.14, Math.abs(delta) * 0.25);
        hips.rotation.y -= w * delta * 0.15;
      }
    }
    // Hearts rise and fade from the head while petted; the Zzz drifts up while asleep.
    hearts.forEach((sp, i) => {
      const life = pose === 'pet' && spec.hearts !== false ? dt - i * 0.22 : -1;
      sp.visible = life >= 0;
      if (life < 0) return;
      const p = (life % HEART_LIFE) / HEART_LIFE;
      const drift = Math.sin(i * 2.4) * 0.7;
      sp.position.set(
        headR * (drift + Math.sin(p * 6 + i) * 0.08),
        crownY + headR * (0.15 + p * 1.1),
        headR * 0.3,
      );
      const size = headR * (0.45 + p * 0.3) * (0.85 + 0.15 * (i % 3));
      sp.scale.set(size, size, 1);
      (sp.material as THREE.SpriteMaterial).opacity = Math.min(1, p * 5) * (1 - p * p);
    });
    zs.forEach((sp, i) => {
      const life = pose === 'sleep' ? dt - 1.2 - i * 0.4 : -1;
      const q = life < 0 ? 1 : (life % Z_EVERY) / Z_EVERY / 0.7;
      sp.visible = q < 1;
      if (q >= 1) return;
      sp.position.set(headR * (0.6 + q * 0.6), hb.max.y + headR * (0.1 + q * 1.2), headR * 0.2);
      const size = headR * (0.4 + q * 0.45);
      sp.scale.set(size, size, 1);
      (sp.material as THREE.SpriteMaterial).opacity = Math.sin(q * Math.PI);
    });
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
      // Planted feet: no foot the walk placed may sink into a slope either.
      if (pose === 'walk' && legs.length) {
        root.updateMatrix();
        let sink = 0;
        for (const leg of legs) {
          contact.copy(leg.placed).applyMatrix4(root.matrix);
          sink = Math.max(sink, rig.ground(contact.x, contact.z) - GROUND_SINK - contact.y);
        }
        root.position.y += sink;
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
    // The irises: each eye takes the look point in its own frame, so the pair converge on
    // a near point by themselves; with nothing to look at they drift in a slow wander.
    if (rig.lookAt) root.updateWorldMatrix(true, true);
    const ease = 1 - Math.exp(-IRIS_EASE * fdt);
    eyes.forEach((e, i) => {
      const u = e.iris.userData as { r: number; tall: number; depth: number };
      let tx: number;
      let ty: number;
      if (rig.lookAt) {
        gaze.copy(rig.lookAt);
        e.group.worldToLocal(gaze);
        const len = gaze.length() || 1;
        // Direction sines scaled so about 30 degrees off-axis already reaches the limit.
        tx = (gaze.x / len) * 2 * IRIS_TRAVEL;
        ty = (gaze.y / len) * 2 * IRIS_TRAVEL;
        const m = Math.hypot(tx, ty);
        if (m > IRIS_TRAVEL) {
          tx *= IRIS_TRAVEL / m;
          ty *= IRIS_TRAVEL / m;
        }
      } else {
        tx = Math.sin(t * 0.37 + i * 0.4) * 0.09;
        ty = Math.sin(t * 0.53 + 1.3 + i * 0.4) * 0.06;
      }
      const ox = e.iris.position.x / u.r;
      const oy = e.iris.position.y / u.r;
      const nx = ox + (tx - ox) * ease;
      const ny = oy + (ty - oy) * ease;
      // The disc follows the dome down as it slides, so it never floats off the eyeball.
      const dz = (-u.depth * (nx * nx + (ny / u.tall) * (ny / u.tall)) * u.r) / 2;
      e.iris.position.set(nx * u.r, ny * u.r, dz);
    });
  };
  const rig: Rigged = {
    group: root,
    name: spec.name,
    bones,
    strideLength: stride.length,
    stridePeriod: stride.period,
    animate,
    lookAt: null,
    setPose: (p) => {
      if (p !== pose) {
        pose = p;
        poseSince = now;
      }
    },
    face: (yaw) => {
      const from = faced ? root.rotation.y : (yawFrom = yawTo = root.rotation.y);
      faced = true;
      // The shortest way round from where the turn is now.
      const delta = Math.atan2(Math.sin(yaw - yawTo), Math.cos(yaw - yawTo));
      if (Math.abs(delta) < 1e-4) return;
      yawFrom = from;
      yawTo = from + Math.atan2(Math.sin(yaw - from), Math.cos(yaw - from));
      turnAt = now;
    },
  };
  return rig;
}

export { V };
