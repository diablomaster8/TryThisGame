import * as THREE from 'three';
import { PHOTO3D } from '../config/tuning-photo3d';
import type { Expression, PoseName, Rigged } from './art/species';

/**
 * R0412 (LOOK-56): the Full 3D photo mode's camera and subjects. The UI (`ui/photo-3d.ts`)
 * owns the state; the scene lays the camera over its own each frame while the mode is open
 * (`Grove3dScene.photo`), and the actors draw each subject at its spot, facing, pose and face
 * (`Actors.photo`). The sim never hears of any of it: a held subject is only drawn there.
 */

/** A free camera round a look point: orbit, tilt, distance and roll. */
export interface PhotoCam {
  target: { x: number; y: number; z: number };
  /** Orbit yaw, radians, in the Grove camera's convention (camera at target + sin/cos yaw). */
  yaw: number;
  tiltDeg: number;
  dist: number;
  rollDeg: number;
  /** Depth of field on the subject. */
  dof: boolean;
}

/** One posed subject. */
export interface PhotoSubject {
  x: number;
  z: number;
  /** World yaw the body faces. */
  yaw: number;
  /** The pose, or undefined for the Nubbin's own. */
  pose?: PoseName;
  wave: boolean;
  face: (Partial<Expression> & { wink?: boolean }) | null;
  /** The point the eyes follow (the camera), or null. */
  look: THREE.Vector3 | null;
}

export const PHOTO_POSES = [
  'own',
  'idle',
  'happy',
  'sit',
  'love',
  'flap',
  'sleep',
  'wave',
] as const;
export type PhotoPose = (typeof PHOTO_POSES)[number];
export const PHOTO_FACES = ['own', 'happy', 'wink', 'surprised', 'sleepy'] as const;
export type PhotoFace = (typeof PHOTO_FACES)[number];

/** The expression picker's faces, laid over the pose's own. */
export const FACE_SET: Record<PhotoFace, (Partial<Expression> & { wink?: boolean }) | null> = {
  own: null,
  happy: { lid: 1, squint: 0.3, brow: 0.3, browLift: 0.12, arc: true, frown: 0, gape: 0 },
  wink: { lid: 0, squint: 0.25, brow: 0.25, browLift: 0.08, arc: false, wink: true, frown: 0 },
  surprised: { lid: 0, squint: 0, brow: 0.15, browLift: 0.28, arc: false, gape: 1, frown: 0 },
  sleepy: { lid: 0.6, squint: 0.1, brow: -0.05, browLift: -0.08, arc: false, frown: 0, gape: 0 },
};

/** The rig pose a picker pose plays (`wave` stands and waves an arm over it). */
export function rigPose(p: PhotoPose): PoseName | undefined {
  if (p === 'own') return undefined;
  return p === 'wave' ? 'idle' : p;
}

/** The yaw that faces from (x, z) toward (tx, tz), in the rigs' convention (+z forward). */
export function yawToward(x: number, z: number, tx: number, tz: number): number {
  return Math.atan2(tx - x, tz - z);
}

/**
 * Where each of `count` subjects stands round `centre`: a row across the view (`yaw` is the
 * camera's orbit yaw, so the row runs along the camera's right) or a circle. The first one
 * stands in the middle of the row.
 */
export function formation(
  kind: 'row' | 'circle',
  count: number,
  centre: { x: number; z: number },
  yaw: number,
): { x: number; z: number }[] {
  const out: { x: number; z: number }[] = [];
  if (count <= 0) return out;
  const g = PHOTO3D.group;
  if (kind === 'row' || count === 1) {
    // Camera-right on the ground: perpendicular to the view direction.
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    // Middle-out order: 0, +1, -1, +2, -2 ... so the subject stays centred.
    const slots = Array.from({ length: count }, (_, i) => (i % 2 ? (i + 1) / 2 : -i / 2));
    const shift = count % 2 ? 0 : 0.5;
    for (const s of slots) {
      const d = (s - shift) * g.spacing;
      out.push({ x: centre.x + rx * d, z: centre.z + rz * d });
    }
    return out;
  }
  const r = Math.max(g.circleMin, (count * g.spacing) / (2 * Math.PI));
  for (let i = 0; i < count; i++) {
    // The first one on the camera's side of the ring.
    const a = yaw + (i / count) * Math.PI * 2;
    out.push({ x: centre.x + Math.sin(a) * r, z: centre.z + Math.cos(a) * r });
  }
  return out;
}

/** Clamp a camera state to the mode's limits. */
export function clampCam(c: PhotoCam): PhotoCam {
  const k = PHOTO3D.camera;
  c.tiltDeg = THREE.MathUtils.clamp(c.tiltDeg, k.tiltMin, k.tiltMax);
  c.dist = THREE.MathUtils.clamp(c.dist, k.distMin, k.distMax);
  c.rollDeg = THREE.MathUtils.clamp(c.rollDeg, -k.rollMax, k.rollMax);
  return c;
}

/** Put the camera where the photo state says, kept above the ground under it. */
export function applyPhotoCam(
  cam: THREE.PerspectiveCamera,
  c: PhotoCam,
  ground: (x: number, z: number) => number,
): void {
  const t = THREE.MathUtils.degToRad(c.tiltDeg);
  const x = c.target.x + Math.sin(c.yaw) * Math.cos(t) * c.dist;
  const z = c.target.z + Math.cos(c.yaw) * Math.cos(t) * c.dist;
  const y = Math.max(c.target.y + Math.sin(t) * c.dist, ground(x, z) + PHOTO3D.camera.floor);
  cam.position.set(x, y, z);
  cam.lookAt(c.target.x, c.target.y, c.target.z);
  if (c.rollDeg) cam.rotateZ(THREE.MathUtils.degToRad(c.rollDeg));
}

/** The wave: the right arm up and swinging over the stand pose (still under reduced motion). */
export function photoWave(rig: Rigged, t: number, calm: boolean): void {
  const arm = rig.bones.armR ?? rig.bones.armL;
  if (!arm) return;
  const side = rig.bones.armR ? -1 : 1;
  arm.rotation.z += side * (2.1 + (calm ? 0 : Math.sin(t * Math.PI * 2 * 1.6) * 0.35));
}
