import * as THREE from 'three';
import { V, type Prim } from './sculpted';
import { digits, tuft, tuftRow } from './species-kit';
import type { GestureName, Mark, PoseContext, PoseName, RigContext, SpeciesSpec } from './species';

/**
 * The Keeper in the species format: a kid adventurer in the Saturday-morning manner
 * (Maor's references, 2026-10-15: spiky hair with goggles pushed up on it, a tee under
 * an open vest, shorts, wristbands and chunky sneakers), with the proportions of the
 * hand-built `sculptedKeeper` (the head well over a third of the height, stubby jointed
 * limbs), hands with fingers and the hair as sculpted tufts. The outfit is colour splits
 * between primitives plus crisp marks. The Sun Keeper and the Moon Keeper are the same
 * figure in two colour sets. The Keeper has its own `pet` (reaching out, where a creature
 * leans in) and is the only species with `carry` and `throw`; `idle` and `walk` are the
 * stock biped poses, and the Keeper sleeps sitting up.
 */
export interface KeeperColors {
  skin: string;
  blush: string;
  hair: string;
  tee: string;
  /** The open vest over the tee, and its trim. */
  vest: string;
  trim: string;
  shorts: string;
  stripe: string;
  shoes: string;
  sole: string;
  wristband: string;
  goggleFrame: string;
  goggleGlass: string;
  iris: string;
  /** The badge on the tee: a sun disc or a moon crescent. */
  badge: string;
  emblem: 'sun' | 'moon';
}

export const KEEPER_SUN: KeeperColors = {
  skin: '#ffd2ad',
  blush: '#ffb0a0',
  hair: '#8a5a2a',
  tee: '#2f6fe0',
  vest: '#f0882c',
  trim: '#fff6e0',
  shorts: '#50505c',
  stripe: '#ffd94a',
  shoes: '#e8602a',
  sole: '#fff6e0',
  wristband: '#ffd94a',
  goggleFrame: '#f2f2f2',
  goggleGlass: '#58b8ff',
  iris: '#7a4a28',
  badge: '#ffd94a',
  emblem: 'sun',
};

export const KEEPER_MOON: KeeperColors = {
  skin: '#f3cdb2',
  blush: '#e8a0b0',
  hair: '#3a2a4e',
  tee: '#6a3fb0',
  vest: '#2a2634',
  trim: '#bfb4e0',
  shorts: '#3a3444',
  stripe: '#b8a8ff',
  shoes: '#4a3a7a',
  sole: '#d8d2f0',
  wristband: '#dcd6ff',
  goggleFrame: '#3a3444',
  goggleGlass: '#c080ff',
  iris: '#5a3a9a',
  badge: '#dcd6ff',
  emblem: 'moon',
};

/** The Keeper stage cycles these; `happy` and `eat` are creature poses. */
export const KEEPER_POSES: PoseName[] = ['idle', 'walk', 'pet', 'carry', 'throw', 'sleep'];

/** Timing of the throw cycle, shared with the stage so the thrown creature leaves the hands on cue. */
export const KEEPER_THROW = { period: 3.6, windup: 0.9, release: 1.45, flight: 0.9 };

/** The wrist from the elbow pivot, in body space (right side; mirror x for the left). */
export const KEEPER_WRIST = V(0.18, -0.48, 0.14);
/** The right hand's centre from the elbow, in body space: where a petted Nubbin looks. */
export const KEEPER_HAND_FROM_ELBOW = KEEPER_WRIST.clone().add(V(0.03, -0.09, 0.05));

const smooth = (k: number) => k * k * (3 - 2 * k);

/** One arm with an elbow: a short tee sleeve, bare forearm, a hand with four fingers and a thumb. */
function arm(side: -1 | 1, c: KeeperColors) {
  const s = side;
  const shoulder = V(s * 0.56, 1.95, 0);
  const elbow = V(s * 0.8, 1.5, 0.06);
  const wrist = elbow.clone().add(V(s * KEEPER_WRIST.x, KEEPER_WRIST.y, KEEPER_WRIST.z));
  const hand = wrist.clone().add(V(s * 0.03, -0.09, 0.05));
  const upper: Prim[] = [
    { kind: 'capsule', a: shoulder, b: elbow, r: 0.17, color: c.tee, tag: 'sleeve' },
    { kind: 'sphere', a: elbow, r: 0.17, color: c.tee, tag: 'sleeve' },
  ];
  const lower: Prim[] = [
    { kind: 'sphere', a: elbow, r: 0.16, color: c.skin, tag: 'forearm' },
    { kind: 'capsule', a: elbow, b: wrist, r: 0.14, color: c.skin, tag: 'forearm' },
    { kind: 'sphere', a: hand, r: 0.18, color: c.skin, tag: 'hand' },
    ...digits(hand.clone().add(V(0, -0.06, 0.08)), {
      count: 4,
      spread: 0.3,
      length: 0.17,
      r: 0.06,
      color: c.skin,
      style: 'fingers',
      dir: V(s * 0.15, -0.7, 0.65),
      tag: 'hand',
    }),
    // The thumb sits on the inner side of the hand and points forward.
    {
      kind: 'capsule',
      a: hand.clone().add(V(-s * 0.1, 0.02, 0.1)),
      b: hand.clone().add(V(-s * 0.2, -0.06, 0.26)),
      r: 0.055,
      color: c.skin,
      tag: 'hand',
      blend: 0.05,
    },
  ];
  const x0 = Math.min(s * 0.2, s * 1.4);
  const x1 = Math.max(s * 0.2, s * 1.4);
  return {
    name: side < 0 ? 'armL' : 'armR',
    pivot: shoulder,
    prims: upper,
    box: [V(x0, 1.1, -0.5), V(x1, 2.3, 0.5)] as [THREE.Vector3, THREE.Vector3],
    resolution: 48,
    joint: {
      name: side < 0 ? 'elbowL' : 'elbowR',
      pivot: elbow,
      prims: lower,
      box: [V(x0, 0.5, -0.4), V(x1, 1.8, 0.8)] as [THREE.Vector3, THREE.Vector3],
      resolution: 64,
    },
  };
}

/** One leg with a knee: shorts to the knee, a bare shin, a chunky sneaker. The knee sits a touch forward so it bends like a knee. */
function leg(side: -1 | 1, c: KeeperColors) {
  const s = side;
  const hip = V(s * 0.27, 1.0, 0);
  const knee = V(s * 0.27, 0.6, 0.08);
  const ankle = V(s * 0.27, 0.24, 0.04);
  const upper: Prim[] = [
    { kind: 'capsule', a: hip, b: knee, r: 0.21, color: c.shorts, tag: 'shorts' },
    { kind: 'sphere', a: knee, r: 0.2, color: c.shorts, tag: 'shorts' },
  ];
  const lower: Prim[] = [
    { kind: 'sphere', a: knee, r: 0.17, color: c.skin, tag: 'shin' },
    { kind: 'capsule', a: knee, b: ankle, r: 0.15, color: c.skin, tag: 'shin' },
    {
      kind: 'ellipsoid',
      a: V(s * 0.28, 0.17, 0.08),
      radii: V(0.27, 0.17, 0.4),
      r: 0,
      color: c.shoes,
      tag: 'shoe',
      blend: 0.08,
    },
  ];
  const x0 = Math.min(s * 0.0, s * 0.8);
  const x1 = Math.max(s * 0.0, s * 0.8);
  return {
    name: side < 0 ? 'legL' : 'legR',
    pivot: hip,
    prims: upper,
    box: [V(x0 - 0.1, 0.3, -0.4), V(x1 + 0.1, 1.3, 0.5)] as [THREE.Vector3, THREE.Vector3],
    resolution: 48,
    joint: {
      name: side < 0 ? 'kneeL' : 'kneeR',
      pivot: knee,
      prims: lower,
      box: [V(x0 - 0.1, -0.1, -0.5), V(x1 + 0.1, 0.9, 0.6)] as [THREE.Vector3, THREE.Vector3],
      resolution: 56,
    },
  };
}

/** Reaching out to pet: the right hand goes to `look`, the body leans after it, the hand strokes. */
function pet(c: PoseContext): void {
  const { t, dt, set, look } = c;
  const s = Math.sin;
  const ease = smooth(Math.min(1, dt / 0.5));
  // The creature is low and off to one side: lean the body toward it and bend a knee.
  c.hips.rotation.x = 0.16 * ease;
  c.hips.rotation.y = look.yaw * look.k * 0.5;
  c.hips.position.y -= 0.1 * ease;
  c.bend('legL', 0.4 * ease);
  c.bend('legR', 0.4 * ease);
  set('legL', -0.25 * ease, 0, 0);
  set('legR', -0.25 * ease, 0, 0);
  set('head', (0.25 + look.pitch * 0.6) * ease, look.yaw * look.k * 0.4, 0.1 * ease);
  // The right arm reaches forward and down to the creature's head; the hand strokes
  // with a slow side-to-side at the wrist.
  const stroke = s(t * 3) * 0.12;
  set('armR', -(1.15 + look.pitch * 0.8) * ease, -0.35 * ease + look.yaw * look.k * 0.6, 0);
  set('elbowR', -0.25 * ease, stroke * ease, -0.2 * ease);
  // The left arm hangs back a little for balance.
  set('armL', 0.25 * ease, 0, 0.1 * ease + s(t * 1.6) * 0.05);
  c.mouth(0.2);
}

/** Holding a creature against the chest: both arms forward and bent into a cradle, head tipped down to it. */
function carry(c: PoseContext): void {
  const { t, dt, set } = c;
  const s = Math.sin;
  const ease = smooth(Math.min(1, dt / 0.4));
  c.hips.position.y += s(t * 2.2) * 0.02;
  c.hips.rotation.z = s(t * 1.2) * 0.03;
  c.hips.rotation.x = -0.04 * ease;
  set('head', 0.3 * ease, s(t * 0.7) * 0.1, s(t * 0.9) * 0.05);
  // A hug hold, low in front of the belly: the arms come forward and a little in, the
  // elbows barely bent, so a Nubbin (taller than it looks) rides against the chest with
  // its head beside the Keeper's rather than above it.
  set('armL', -0.55 * ease, 0.15 * ease, 0.1 * ease);
  set('armR', -0.55 * ease, -0.15 * ease, -0.1 * ease);
  set('elbowL', -0.35 * ease, 0, 0.1 * ease);
  set('elbowR', -0.35 * ease, 0, -0.1 * ease);
  set('legL', 0, 0, 0);
  set('legR', 0, 0, 0);
  c.mouth(0.12);
}

/** A two-handed underarm toss: hold, swing the arms back and dip, swing through and release, settle. */
function throwPose(c: PoseContext): void {
  const { t, dt, set } = c;
  const s = Math.sin;
  const T = KEEPER_THROW;
  const ph = dt % T.period;
  // Arm swing: -1 is the cradle (the same hold as `carry`), 0 is hanging straight down,
  // 1 is flung forward and up. `dip` is the crouch into the wind-up, `follow` the spring
  // up after the release.
  let swing: number;
  let dip = 0;
  let follow = 0;
  if (ph < T.windup) {
    swing = -1;
  } else if (ph < T.release) {
    const k = smooth((ph - T.windup) / (T.release - T.windup));
    swing = -1 + k * 0.9;
    dip = k;
  } else if (ph < T.release + 0.25) {
    const k = smooth((ph - T.release) / 0.25);
    swing = -0.1 + k * 1.1;
    dip = 1 - k;
    follow = k;
  } else if (ph < T.period - 0.5) {
    const k = smooth(Math.min(1, (ph - T.release - 0.25) / 0.9));
    swing = 1 - k * 1.3;
    follow = 1 - k;
  } else {
    swing = -0.3 - smooth((ph - (T.period - 0.5)) / 0.5) * 0.7;
  }
  // Shoulders: -0.55 forward for the cradle (as `carry`), 0.45 (a touch back) hanging,
  // -1.9 at the fling.
  const sx = swing <= 0 ? 0.45 + swing * 1.0 : 0.45 - swing * 2.35;
  const inward = Math.max(0, -swing) * 0.15;
  set('armL', sx, inward, 0.1);
  set('armR', sx, -inward, -0.1);
  // Elbows bent for the cradle, nearly straight through the swing.
  const elbow = swing <= 0 ? -0.15 + swing * 0.2 : -0.15 + swing * 0.1;
  set('elbowL', elbow, 0, 0.1);
  set('elbowR', elbow, 0, -0.1);
  c.hips.position.y += -0.16 * dip + 0.06 * follow;
  c.hips.rotation.x = 0.18 * dip - 0.1 * follow;
  c.bend('legL', 0.7 * dip);
  c.bend('legR', 0.7 * dip);
  set('legL', -0.35 * dip, 0, 0);
  set('legR', -0.35 * dip, 0, 0);
  set('head', 0.25 * dip - 0.25 * follow, s(t * 0.7) * 0.05, 0);
  c.mouth(0.1 + follow * 0.5);
}

/** Sits down cross-legged and nods off: hips to the grass, legs folded, hands in the lap, head drooping. */
function sleepSitting(c: PoseContext): void {
  const { t, dt, set } = c;
  const s = Math.sin;
  const ease = smooth(Math.min(1, dt / 1.2));
  // The seat comes down to the grass (the grounding keeps the root where the standing
  // feet were, so the hips drop by exactly the torso's depth below them); the thighs
  // swing forward and splay, and the knees fold the shins back in, a compact sit that
  // leaves room for a Nubbin asleep in front.
  c.hips.position.y -= 0.75 * ease;
  c.hips.rotation.x = 0.1 * ease;
  set('legL', -1.45 * ease, 0, -0.55 * ease);
  set('legR', -1.45 * ease, 0, 0.55 * ease);
  c.bend('legL', 1.3 * ease);
  c.bend('legR', 1.3 * ease);
  set('armL', -0.45 * ease, 0.2 * ease, 0.05 * ease);
  set('armR', -0.45 * ease, -0.2 * ease, -0.05 * ease);
  set('elbowL', -0.6 * ease, 0, 0);
  set('elbowR', -0.6 * ease, 0, 0);
  // The nod: the head sinks, drifts, and catches itself every few seconds.
  const nod = Math.max(0, s(t * 0.9)) * 0.1;
  set('head', (0.45 + nod) * ease, s(t * 0.3) * 0.08 * ease, 0.12 * ease);
  c.mouth(0.08);
}

/** How far ahead of the hips a seated Keeper's soles rest, in body units. */
const SIT_FOOT_AHEAD = 0.45;

/**
 * K1: sits. On a seat (a step, a bench, a cart's tail) the hips settle onto it, the thighs
 * reach forward and the soles find the ground; on the ground (a seat under 0.15 body units) the legs fold
 * cross-legged as in `sleepSitting`, but awake: the back straight, the head up, the hands on
 * the knees. A slow breath, held still under reduced motion.
 */
function sit(c: PoseContext): void {
  const { t, dt, set } = c;
  const s = Math.sin;
  const ease = c.still ? 1 : smooth(Math.min(1, dt / 0.8));
  const sway = c.still ? 0 : 1;
  // Hips at rest are 1.0 over the feet; on a seat they rest on its surface plus the thigh's
  // thickness. A seat lower than a step (under 0.15 body units) is the ground: cross-legged.
  const chair = c.seat >= 0.15;
  const hipY = chair ? Math.min(0.95, c.seat + 0.2) : 0.25;
  c.hips.position.y -= (1.0 - hipY) * ease;
  c.hips.rotation.x = (chair ? -0.04 : 0.04) * ease;
  if (chair) {
    // Two-bone reach: the soles go to the ground a little ahead of the hips, so a low step
    // brings the knees up and a high bench lets the shins hang.
    const L1 = 0.4;
    const L2 = 0.6;
    const f = SIT_FOOT_AHEAD;
    const d = THREE.MathUtils.clamp(Math.hypot(f, hipY), L2 - L1 + 0.01, L1 + L2 - 0.01);
    const bend = Math.acos(
      THREE.MathUtils.clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1),
    );
    const along = Math.acos(
      THREE.MathUtils.clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1),
    );
    const thigh = Math.atan2(f, hipY) + along;
    set('legL', -thigh * ease, 0, -0.1 * ease);
    set('legR', -thigh * ease, 0, 0.1 * ease);
    c.bend('legL', bend * ease);
    c.bend('legR', bend * ease);
  } else {
    set('legL', -1.45 * ease, 0, -0.55 * ease);
    set('legR', -1.45 * ease, 0, 0.55 * ease);
    c.bend('legL', 1.3 * ease);
    c.bend('legR', 1.3 * ease);
  }
  // Hands resting on the knees.
  set('armL', -0.7 * ease, 0.12 * ease, 0.05 * ease);
  set('armR', -0.7 * ease, -0.12 * ease, -0.05 * ease);
  set('elbowL', -0.45 * ease, 0, 0);
  set('elbowR', -0.45 * ease, 0, 0);
  c.hips.position.y += s(t * 1.4) * 0.008 * sway;
  set('head', -0.04 * ease, s(t * 0.4) * 0.06 * sway, 0);
  c.mouth(0.06);
}

/** K1: down on the left knee, the right foot planted, a hand on the raised knee. */
function kneel(c: PoseContext): void {
  const { t, dt, set } = c;
  const ease = c.still ? 1 : smooth(Math.min(1, dt / 0.6));
  c.hips.position.y -= 0.42 * ease;
  c.hips.rotation.x = 0.1 * ease;
  // The left thigh drops straight under the hips and the shin lies back along the grass.
  set('legL', 0.15 * ease, 0, -0.05 * ease);
  c.bend('legL', 1.55 * ease);
  // The right thigh reaches forward, the knee folds the foot back under it.
  set('legR', -1.35 * ease, 0, 0.06 * ease);
  c.bend('legR', 1.4 * ease);
  set('armR', -0.85 * ease, -0.1 * ease, -0.05 * ease);
  set('elbowR', -0.5 * ease, 0, 0);
  set('armL', -0.35 * ease, 0.15 * ease, 0.1 * ease);
  set('elbowL', -0.4 * ease, 0, 0);
  set('head', 0.12 * ease, Math.sin(t * 0.5) * 0.05 * (c.still ? 0 : 1), 0);
  c.mouth(0.08);
}

/**
 * K39: the item-get pose. Both hands lift the found thing high overhead, the chin up; the
 * raise takes 0.3 s (none under reduced motion: the pose is held from the first frame).
 */
function itemGet(c: PoseContext): void {
  const { dt, set } = c;
  const ease = c.still ? 1 : smooth(Math.min(1, dt / 0.3));
  c.hips.position.y += 0.05 * ease;
  c.hips.rotation.x = -0.06 * ease;
  // Up and a little forward, wide apart, so the hands frame the thing over the head rather
  // than meet behind it (the head is big).
  set('armL', -2.5 * ease, 0, -0.45 * ease);
  set('armR', -2.5 * ease, 0, 0.45 * ease);
  set('elbowL', -0.15 * ease, 0, 0);
  set('elbowR', -0.15 * ease, 0, 0);
  set('legL', 0, 0, 0);
  set('legR', 0, 0, 0);
  set('head', -0.3 * ease, 0, 0);
  c.mouth(0.45);
}

/**
 * K7: the five line gestures, laid over whatever the body holds with weight `k`. A nod dips
 * twice (once, held, under reduced motion); a shrug lifts the forearms palm-up; a point sends
 * the right arm out; a look down drops the chin; hands to the chest cross both forearms.
 */
const GESTURES: Partial<Record<GestureName, (c: PoseContext, k: number, t: number) => void>> = {
  nod: (c, k, t) => {
    const dip = c.still ? 0.18 : 0.06 + Math.abs(Math.sin(t * Math.PI * 2.2)) * 0.2;
    c.add('head', dip * k, 0, 0);
  },
  shrug: (c, k) => {
    c.add('armL', -0.25 * k, 0, 0.35 * k);
    c.add('armR', -0.25 * k, 0, -0.35 * k);
    c.add('elbowL', -0.9 * k, 0.3 * k, 0);
    c.add('elbowR', -0.9 * k, -0.3 * k, 0);
    c.add('head', -0.05 * k, 0, 0.14 * k);
    c.hips.position.y += 0.03 * k;
  },
  point: (c, k) => {
    c.add('armR', -1.45 * k, -0.2 * k, 0);
    c.add('elbowR', 0.1 * k, 0, 0);
    c.add('head', -0.05 * k, -0.15 * k, 0);
  },
  down: (c, k) => {
    c.add('head', 0.42 * k, 0, 0);
    c.hips.rotation.x += 0.06 * k;
  },
  chest: (c, k) => {
    c.add('armL', -0.55 * k, 0.45 * k, 0);
    c.add('armR', -0.55 * k, -0.45 * k, 0);
    c.add('elbowL', -1.25 * k, 0, 0.2 * k);
    c.add('elbowR', -1.25 * k, 0, -0.2 * k);
    c.add('head', 0.12 * k, 0, 0);
  },
};

/**
 * K13 and K6: the rig's named pivots. `hand.R` hangs under the right elbow at the hand's
 * centre, so a carried prop (a lantern, a broom, keys) follows the arm; `neck` names the
 * head's own pivot (the head bone turns at the neck).
 */
function keeperPivots(rig: RigContext): void {
  const elbow = rig.bones.elbowR;
  if (elbow) {
    const hand = new THREE.Group();
    hand.name = 'hand.R';
    hand.position.copy(KEEPER_HAND_FROM_ELBOW);
    elbow.add(hand);
    rig.bones['hand.R'] = hand;
  }
  if (rig.bones.head) rig.bones.neck = rig.bones.head;
}

/**
 * Changes to the stock figure for a figure built on the same body and rig (the player's own
 * avatar, `grandchild-spec.ts`): its own hair, no goggles, no open vest or wristbands, extra
 * head prims and marks, and its own eyes. Left out, the Keeper is drawn as it always was.
 */
export interface KeeperFigure {
  hair?: Prim[];
  goggles?: boolean;
  vest?: boolean;
  wristbands?: boolean;
  head?: Prim[];
  marks?: Mark[];
  eyes?: Partial<SpeciesSpec['eyes']>;
  notes?: string;
}

/** Build the Keeper in one colour set. */
export function keeperSpec(c: KeeperColors, name = 'Keeper', fig: KeeperFigure = {}): SpeciesSpec {
  const stockHair: Prim[] = [
    // A spiky mop: a cap over the skull, big tufts sweeping up and back over the crown,
    // side spikes out over the ears, and a short fringe under the goggle band.
    {
      kind: 'ellipsoid',
      a: V(0, 2.88, -0.12),
      radii: V(0.68, 0.46, 0.64),
      r: 0,
      color: c.hair,
      tag: 'hair',
      blend: 0.06,
    },
    ...tuftRow(
      V(-0.36, 3.12, 0.1),
      V(0.36, 3.12, 0.1),
      4,
      V(0, 1, -0.45),
      0.5,
      0.17,
      c.hair,
      1,
      'hair',
    ),
    tuft(V(-0.2, 3.1, -0.3), V(-0.35, 0.9, -0.6), 0.48, 0.16, c.hair, 'hair'),
    tuft(V(0.22, 3.1, -0.3), V(0.4, 0.9, -0.6), 0.48, 0.16, c.hair, 'hair'),
    tuft(V(0, 3.0, -0.55), V(0, 0.5, -1), 0.42, 0.16, c.hair, 'hair'),
    tuft(V(-0.58, 2.95, 0.05), V(-1, 0.35, 0.1), 0.38, 0.15, c.hair, 'hair'),
    tuft(V(0.58, 2.95, 0.05), V(1, 0.35, 0.1), 0.38, 0.15, c.hair, 'hair'),
    tuft(V(-0.5, 2.8, 0.3), V(-0.5, -0.8, 0.5), 0.3, 0.12, c.hair, 'hair'),
    tuft(V(0.5, 2.8, 0.3), V(0.5, -0.8, 0.5), 0.3, 0.12, c.hair, 'hair'),
    ...tuftRow(
      V(-0.3, 2.9, 0.5),
      V(0.3, 2.9, 0.5),
      3,
      V(0, -0.6, 0.7),
      0.24,
      0.11,
      c.hair,
      1,
      'hair',
    ),
  ];
  const hair = fig.hair ?? stockHair;
  const goggles: Prim[] = [
    // Goggles pushed up on the hair: a band round the head at the hairline and two
    // round lenses at the front. The glass is a crisp mark on each lens.
    {
      kind: 'torus',
      a: V(0, 2.98, -0.06),
      r: 0.63,
      r2: 0.065,
      color: c.goggleFrame,
      tag: 'goggles',
      blend: 0.04,
    },
    {
      kind: 'sphere',
      a: V(-0.21, 3.02, 0.56),
      r: 0.16,
      color: c.goggleFrame,
      tag: 'goggles',
      blend: 0.04,
    },
    {
      kind: 'sphere',
      a: V(0.21, 3.02, 0.56),
      r: 0.16,
      color: c.goggleFrame,
      tag: 'goggles',
      blend: 0.04,
    },
  ];
  const badge: Mark[] =
    c.emblem === 'sun'
      ? [{ kind: 'sphere', a: V(0, 1.7, 0.5), r: 0.12, color: c.badge }]
      : [
          { kind: 'sphere', a: V(0, 1.7, 0.5), r: 0.12, color: c.badge },
          // The second disc, in the tee colour, cuts the crescent.
          { kind: 'sphere', a: V(0.065, 1.74, 0.52), r: 0.1, color: c.tee },
        ];
  const glass: Mark[] = [
    { kind: 'sphere', a: V(-0.21, 3.03, 0.66), r: 0.11, color: c.goggleGlass, soft: 0 },
    { kind: 'sphere', a: V(0.21, 3.03, 0.66), r: 0.11, color: c.goggleGlass, soft: 0 },
  ];
  const vest: Mark[] = [
    // The open vest: two panels down the sides of the tee, meeting at the back, with
    // a pale trim along their front edges and a collar at the neck.
    {
      kind: 'ellipsoid',
      a: V(-0.52, 1.7, -0.08),
      radii: V(0.36, 0.5, 0.56),
      color: c.vest,
      soft: 0,
    },
    {
      kind: 'ellipsoid',
      a: V(0.52, 1.7, -0.08),
      radii: V(0.36, 0.5, 0.56),
      color: c.vest,
      soft: 0,
    },
    {
      kind: 'capsule',
      a: V(-0.28, 2.08, 0.4),
      b: V(-0.2, 1.3, 0.46),
      r: 0.045,
      color: c.trim,
      soft: 0,
    },
    {
      kind: 'capsule',
      a: V(0.28, 2.08, 0.4),
      b: V(0.2, 1.3, 0.46),
      r: 0.045,
      color: c.trim,
      soft: 0,
    },
    { kind: 'ellipsoid', a: V(0, 2.15, 0), radii: V(0.42, 0.07, 0.42), color: c.trim, soft: 0 },
  ];
  const stripes: Mark[] = [
    // Shorts: a stripe down each outer thigh.
    {
      kind: 'capsule',
      a: V(-0.5, 1.05, 0.02),
      b: V(-0.46, 0.62, 0.08),
      r: 0.035,
      color: c.stripe,
      soft: 0,
    },
    {
      kind: 'capsule',
      a: V(0.5, 1.05, 0.02),
      b: V(0.46, 0.62, 0.08),
      r: 0.035,
      color: c.stripe,
      soft: 0,
    },
  ];
  const wrists: Mark[] = [
    // Wristbands, and a sleeve band where the tee sleeve ends.
    {
      kind: 'ellipsoid',
      a: V(-0.96, 1.07, 0.19),
      radii: V(0.22, 0.065, 0.22),
      color: c.wristband,
      soft: 0,
    },
    {
      kind: 'ellipsoid',
      a: V(0.96, 1.07, 0.19),
      radii: V(0.22, 0.065, 0.22),
      color: c.wristband,
      soft: 0,
    },
  ];
  const sneakers: Mark[] = [
    // Sneakers: a pale sole and toe cap, a sock band at the ankle.
    {
      kind: 'ellipsoid',
      a: V(-0.28, 0.06, 0.08),
      radii: V(0.32, 0.07, 0.46),
      color: c.sole,
      soft: 0,
    },
    {
      kind: 'ellipsoid',
      a: V(0.28, 0.06, 0.08),
      radii: V(0.32, 0.07, 0.46),
      color: c.sole,
      soft: 0,
    },
    { kind: 'sphere', a: V(-0.28, 0.14, 0.5), r: 0.13, color: c.sole, soft: 0 },
    { kind: 'sphere', a: V(0.28, 0.14, 0.5), r: 0.13, color: c.sole, soft: 0 },
    {
      kind: 'ellipsoid',
      a: V(-0.27, 0.34, 0.04),
      radii: V(0.24, 0.05, 0.24),
      color: c.trim,
      soft: 0,
    },
    {
      kind: 'ellipsoid',
      a: V(0.27, 0.34, 0.04),
      radii: V(0.24, 0.05, 0.24),
      color: c.trim,
      soft: 0,
    },
  ];
  return {
    name,
    scale: 1,
    gait: 'biped',
    hipY: 1.0,
    // Long, brisk strides: the Keeper covers KEEPER.speed at 3.5 cycles a second (2.45x
    // this pace) instead of a 6x buzz. The jog's short stance keeps the knee bend to a
    // fifth of the leg; at the stock 0.6 this stride crouches to over a third.
    stride: { length: 2.2, period: 0.7, duty: 0.45 },
    blend: 0.14,
    surface: {
      detail: 'smooth',
      amount: 0.1,
      bump: 0.12,
      roughness: 0.72,
      sheen: 0.5,
      sheenColor: '#fff2e0',
      clearcoat: 0.03,
    },
    torso: {
      prims: [
        {
          kind: 'ellipsoid',
          a: V(0, 1.22, 0.02),
          radii: V(0.58, 0.46, 0.48),
          r: 0,
          color: c.shorts,
          tag: 'shorts',
        },
        {
          kind: 'ellipsoid',
          a: V(0, 1.72, 0),
          radii: V(0.58, 0.48, 0.48),
          r: 0,
          color: c.tee,
          tag: 'tee',
        },
        // A neck stub inside the head, so the join stays soft when the head turns.
        { kind: 'sphere', a: V(0, 2.12, 0), r: 0.22, color: c.skin, tag: 'neck' },
      ],
      box: [V(-0.9, 0.5, -0.9), V(0.9, 2.5, 0.9)],
    },
    head: {
      name: 'head',
      pivot: V(0, 2.1, 0),
      prims: [
        {
          kind: 'ellipsoid',
          a: V(0, 2.6, 0),
          radii: V(0.66, 0.6, 0.62),
          r: 0,
          color: c.skin,
          tag: 'head',
        },
        { kind: 'sphere', a: V(0, 2.5, 0.62), r: 0.12, color: c.skin, tag: 'nose', blend: 0.08 },
        { kind: 'sphere', a: V(-0.64, 2.55, -0.02), r: 0.12, color: c.skin, tag: 'ear' },
        { kind: 'sphere', a: V(0.64, 2.55, -0.02), r: 0.12, color: c.skin, tag: 'ear' },
        ...hair,
        ...(fig.goggles === false ? [] : goggles),
        ...(fig.head ?? []),
      ],
      box: [V(-1.1, 1.8, -1.1), V(1.1, 3.8, 1.1)],
    },
    parts: [arm(-1, c), arm(1, c), leg(-1, c), leg(1, c)],
    shade: { top: 1.08, bottom: 0.74, yMax: 3.2 },
    marks: [
      // Cheeks.
      {
        kind: 'ellipsoid',
        a: V(-0.4, 2.42, 0.5),
        radii: V(0.14, 0.08, 0.1),
        color: c.blush,
        soft: 0.1,
      },
      {
        kind: 'ellipsoid',
        a: V(0.4, 2.42, 0.5),
        radii: V(0.14, 0.08, 0.1),
        color: c.blush,
        soft: 0.1,
      },
      // Goggle glass on the lenses.
      ...(fig.goggles === false ? [] : glass),
      ...(fig.vest === false ? [] : vest),
      ...badge.map((b) => ({ ...b, soft: 0 })),
      ...stripes,
      ...(fig.wristbands === false ? [] : wrists),
      ...sneakers,
      ...(fig.marks ?? []),
    ],
    eyes: {
      x: 0.26,
      y: 2.58,
      z: 0.58,
      r: 0.15,
      iris: c.iris,
      lidColor: c.skin,
      yaw: 0,
      lid: 0.12,
      irisScale: 0.72,
      tall: 1.3,
      ...fig.eyes,
    },
    mouth: {
      x: 0,
      y: 2.3,
      z: 0.6,
      width: 0.18,
      lip: '#9a4a4a',
      teeth: false,
      tongue: '#ff8a9a',
      shape: 'smile',
    },
    expressions: {
      pet: { lid: 0.2, squint: 0.3, brow: 0.3, browLift: 0.05, arc: false },
    },
    poses: { pet, carry, throw: throwPose, sleep: sleepSitting, sit, kneel, itemGet },
    gestures: GESTURES,
    extras: keeperPivots,
    hearts: false,
    footprint: 0.7,
    notes:
      fig.notes ??
      'Keeper pass 2026-10-15: proportions from sculptedKeeper (head ~39% of the height); ' +
        "outfit after Maor's three kid-adventurer references (goggles on spiky hair, tee and " +
        'vest, shorts, wristbands, sneakers); poses checked on the Keeper stage ' +
        '(docs/samples/keeper-idle.jpg, keeper-pet.jpg, keeper-45.jpg).',
  };
}

export const KEEPER_SPEC: SpeciesSpec = keeperSpec(KEEPER_SUN, 'Sun Keeper');
export const KEEPER_MOON_SPEC: SpeciesSpec = keeperSpec(KEEPER_MOON, 'Moon Keeper');
