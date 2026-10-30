import type * as THREE from 'three';

/**
 * R0085: the Keeper's rig shrinks on a Nubbin's back (a Chao-sized carrier) and returns to its
 * own size on getting down. The rig's own scale is kept the first time and multiplied, so a
 * squash or a staged scale on top of it is untouched.
 */
export function rideScale(group: THREE.Object3D | undefined, scale: number): void {
  if (!group) return;
  const was = group.userData.rideScale as number | undefined;
  if (scale === 1 && was === undefined) return;
  const by = scale / (was ?? 1);
  if (by !== 1) group.scale.multiplyScalar(by);
  if (scale === 1) delete group.userData.rideScale;
  else group.userData.rideScale = scale;
}
