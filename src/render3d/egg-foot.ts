/**
 * R0351 (FUN-62): the foot gag in Full 3D: on every third shake a tiny child's foot, pale
 * blue with a yellow toe, pokes out of the bottom of the egg and goes back in. One shared
 * geometry and material; the foot is a child of the shell, placed from its bounding box.
 */
import * as THREE from 'three';

const GEO = new THREE.SphereGeometry(1, 10, 8);
const MAT = new THREE.MeshLambertMaterial({ color: '#9fd6f2' });
const TOE = new THREE.MeshLambertMaterial({ color: '#f5d33a' });

/** Show or hide the foot under this egg's shell. */
export function updateEggFoot(shell: THREE.Mesh, on: boolean): void {
  const ud = shell.userData as { foot?: THREE.Object3D };
  if (!on) {
    if (ud.foot) ud.foot.visible = false;
    return;
  }
  if (!ud.foot) {
    shell.geometry.computeBoundingBox();
    const b = shell.geometry.boundingBox!;
    const size = b.max.y - b.min.y;
    const foot = new THREE.Group();
    const sole = new THREE.Mesh(GEO, MAT);
    sole.scale.set(size * 0.11, size * 0.06, size * 0.15);
    const toe = new THREE.Mesh(GEO, TOE);
    toe.scale.set(size * 0.07, size * 0.045, size * 0.06);
    toe.position.z = size * 0.12;
    foot.add(sole, toe);
    foot.position.set((b.max.x - b.min.x) * 0.12, b.min.y + size * 0.05, (b.max.z - b.min.z) * 0.3);
    shell.add(foot);
    ud.foot = foot;
  }
  ud.foot.visible = true;
}
