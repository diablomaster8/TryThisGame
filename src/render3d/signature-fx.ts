import * as THREE from 'three';
import type { SignatureFrame } from '../render/signature';
import type { Bursts, BurstKind } from './bursts';

/**
 * R0410 (LOOK-44): the 3D half of the signature beats' particles. Pixel throws a particle
 * on the beat's ticks (`SignatureFrame.burst`); here the same ticks throw a small burst from
 * the shared `Bursts` cloud (one draw call for every burst in the Grove): cheek sparks, sung
 * notes, tail embers and a mole's dust. Under reduced motion nothing is thrown at all.
 */
const KIND: Record<string, BurstKind> = {
  sparkle: 'spark',
  ember: 'ember',
  note: 'note',
  dust: 'dust',
};

const LOOK: Partial<
  Record<BurstKind, { count: number; spread: number; speed: number; rise: number; lifeMs: number }>
> = {
  spark: { count: 3, spread: 0.25, speed: 1.4, rise: 0.4, lifeMs: 320 },
  ember: { count: 2, spread: 0.12, speed: 0.2, rise: 0.7, lifeMs: 900 },
  note: { count: 1, spread: 0.2, speed: 0.15, rise: 0.6, lifeMs: 1400 },
  dust: { count: 3, spread: 0.3, speed: 0.6, rise: 0.1, lifeMs: 500 },
};

/** The beat's ticks are 120 ms apart and last 40 ms, so a tick fires at most once. */
const GAP_MS = 100;

export class SignatureFx {
  private readonly last = new Map<string, number>();
  private readonly at = new THREE.Vector3();

  constructor(private readonly bursts: Bursts) {}

  /** Throw this frame's particle for Nubbin `id`, if the beat has one now. */
  play(
    id: string,
    f: SignatureFrame,
    spot: { feet: THREE.Vector3; head: THREE.Vector3 } | null,
    nowMs: number,
    calm: boolean,
  ): void {
    if (calm || !f.burst || !spot) return;
    const kind = KIND[f.burst];
    const look = kind ? LOOK[kind] : undefined;
    if (!kind || !look) return;
    const prev = this.last.get(id) ?? -Infinity;
    if (nowMs - prev < GAP_MS && nowMs >= prev) return;
    this.last.set(id, nowMs);
    this.at.copy(spot.feet).lerp(spot.head, f.burstAt ?? 0.5);
    this.bursts.burst(kind, this.at, look.count, look, nowMs);
  }

  /** Forget Nubbins no longer shown. */
  prune(live: ReadonlySet<string>): void {
    for (const id of this.last.keys()) if (!live.has(id)) this.last.delete(id);
  }
}
