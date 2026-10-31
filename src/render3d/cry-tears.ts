import * as THREE from 'three';
import { CRY_TEARS } from '../config/tuning-look-r10e';
import type { Bursts } from './bursts';

/**
 * LOOK-21 (lane E r10): a crying Nubbin's two tear streams in 3D. Every 250 ms a light-blue
 * drop arcs out from each eye, thrown into the shared `Bursts` cloud (one draw call for every
 * burst in the Grove, no new material). Under reduced motion nothing is thrown: the cry pose
 * still sits, rubs and wails.
 */
export class CryTears {
  private readonly last = new Map<string, number>();
  private readonly at = new THREE.Vector3();
  private readonly v = new THREE.Vector3();
  private readonly side = new THREE.Vector3();
  private static readonly UP = new THREE.Vector3(0, 1, 0);

  constructor(private readonly bursts: Bursts) {}

  /** Throw this frame's tears for Nubbin `id`, if its 250 ms beat has come round. */
  play(
    id: string,
    spot: { feet: THREE.Vector3; head: THREE.Vector3 } | null,
    front: THREE.Vector3 | null,
    nowMs: number,
    calm: boolean,
  ): void {
    if (calm || !spot || !front) return;
    const prev = this.last.get(id);
    if (prev !== undefined && nowMs - prev < CRY_TEARS.everyMs && nowMs >= prev) return;
    this.last.set(id, nowMs);
    const T = CRY_TEARS;
    const h = Math.max(0.1, spot.head.y - spot.feet.y);
    this.side.crossVectors(front, CryTears.UP).normalize();
    for (const s of [-1, 1]) {
      this.at
        .copy(spot.feet)
        .lerp(spot.head, T.eyeK)
        .addScaledVector(front, T.eyeFwd * h)
        .addScaledVector(this.side, s * T.eyeSide * h);
      this.v
        .copy(this.side)
        .multiplyScalar(s * T.side)
        .addScaledVector(front, T.fwd)
        .addScaledVector(CryTears.UP, T.up);
      this.bursts.drop('tear', this.at, this.v, T.lifeMs, nowMs);
    }
  }

  /** Forget Nubbins no longer crying or shown. */
  forget(id: string): void {
    this.last.delete(id);
  }
}
