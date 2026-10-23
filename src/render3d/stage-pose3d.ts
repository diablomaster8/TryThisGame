import type * as THREE from 'three';
import { POSE_CUES, POSE_FLAGS } from '../render/stage-pose';
import type { PoseName, Rigged } from '../samples/species';

/**
 * Campaign graphics 4, package a1, Full 3D: hands a figure's stage cue (render/stage-pose.ts)
 * to its rig. The crowd and the actors call `poseRig` for every rig they drive, by figure id;
 * it sets the head's attend point (K6, K41), the gesture (K7), the seat and reduced motion,
 * and returns the pose to hold (K1 `sit`/`kneel`, K39 `itemGet`) or null to keep their own.
 * It also notes the rig by id for the frame, so the dressings can find a hand (K13).
 */
const RIGS = new Map<string, Rigged>();

export function poseRig(rig: Rigged, id: string): PoseName | null {
  RIGS.set(id, rig);
  const c = POSE_CUES.get(id);
  rig.attend = c?.attend ?? null;
  rig.gesture = c?.gesture ?? null;
  rig.seat = c?.seatY ?? 0;
  rig.still = POSE_FLAGS.still;
  return c?.pose ?? null;
}

/** K13: the right-hand pivot of the figure drawn as `id` this frame, or null. */
export function handOf(id: string): THREE.Object3D | null {
  const rig = RIGS.get(id);
  if (!rig || !rig.group.parent) return null;
  return rig.bones['hand.R'] ?? null;
}

/** Called once a frame after the dressings that read hands: the next frame notes afresh. */
export function clearRigs(): void {
  RIGS.clear();
}

/** K13: the figure's right hand in world space, written into `out`; false when not drawn. */
export function handPoint(id: string, out: THREE.Vector3): boolean {
  const hand = handOf(id);
  if (!hand) return false;
  hand.updateWorldMatrix(true, false);
  hand.getWorldPosition(out);
  return true;
}
