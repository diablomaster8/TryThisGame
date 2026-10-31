import type * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import { V, type Prim } from '../samples/sculpted';
import type { SpeciesSpec } from '../samples/species';

/**
 * The flame tail tip in 3D (LOOK-10): Charmander's line, Ponyta's and the fire bird's. The
 * flame is a part of its own (`tailFlame`) that the extras hook hangs on the tail bone, so
 * it wags with the tail and flickers on its own: scale 0.9 to 1.1 at 6 Hz. The tail sweeps
 * out to one side, so the flame shows past the head from the front, as on the reference.
 */
export const FLAME_PART = 'tailFlame';
export const FLAME_HZ = 6;
export const FLAME_AMP = 0.1;

/** How far the tail sweeps sideways: a round baby's big head hides a straight tail. */
export function flameSweep(art: CreatureSpec): number {
  return art.plan === 'round' ? 1.05 : 0.7;
}

const cap = (a: THREE.Vector3, b: THREE.Vector3, r: number, c: string): Prim => ({
  kind: 'capsule',
  a,
  b,
  r,
  color: c,
});
const cone = (a: THREE.Vector3, b: THREE.Vector3, r: number, r2: number, c: string): Prim => ({
  kind: 'cone',
  a,
  b,
  r,
  r2,
  color: c,
  blend: 0.1,
  glow: 1,
});

/** The tail stem (for the `tail` part) and the flame (its own part, pivoting at its base). */
export function flameTailPrims(
  art: CreatureSpec,
  root: THREE.Vector3,
  c: Record<string, string>,
): { stem: Prim[]; flame: Prim[]; base: THREE.Vector3 } {
  const sx = flameSweep(art);
  const at = (x: number, y: number, z: number) => root.clone().add(V(x, y, z));
  const mid = at(sx * 0.55, 0.12, -0.42);
  const end = at(sx, 0.42, -0.36);
  const stem = [cap(root, mid, 0.12, c.body!), cap(mid, end, 0.11, c.body!)];
  const base = end.clone();
  const flame = [
    cone(at(sx, 0.36, -0.36), at(sx * 1.04, 1.05, -0.42), 0.3, 0.03, c.accent!),
    // The hot core.
    cone(at(sx, 0.38, -0.3), at(sx * 1.02, 0.8, -0.36), 0.16, 0.02, '#ffe27a'),
  ];
  return { stem, flame, base };
}

/** The flicker's scale at `t` seconds; still under reduced motion. */
export function flameScale(t: number, still = false): number {
  return still ? 1 : 1 + FLAME_AMP * Math.sin(t * Math.PI * 2 * FLAME_HZ);
}

const reduced = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  } catch {
    return false;
  }
};

/** Hang the flame on the tail bone and flicker it, after any hook the spec already had. */
export function withFlameFlicker(spec: SpeciesSpec): SpeciesSpec {
  if (!spec.parts.some((p) => p.name === FLAME_PART)) return spec;
  const prev = spec.extras;
  return {
    ...spec,
    extras: (rig) => {
      const before = prev?.(rig);
      const flame = rig.bones[FLAME_PART];
      const tail = rig.bones.tail;
      // `attach` keeps the flame where it is while making it the tail's child.
      if (flame && tail) tail.attach(flame);
      const still = reduced();
      return (t, pose) => {
        if (before) before(t, pose);
        if (flame) flame.scale.setScalar(flameScale(t, still || pose === 'sleep'));
      };
    },
  };
}
