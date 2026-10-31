import * as THREE from 'three';

/**
 * R0325 (FUN-36): the 3D race's butterfly. While the player's Nubbin has stopped to look at
 * one (`Racer.gazeUntilMs`, sim/race.ts), a small yellow butterfly flutters in front of its
 * face and the Nubbin's eyes follow it; the Pixel race draws the same gag in 2D. One group of
 * two wing quads, built with the race and compiled with its scenery (parked out of sight
 * until it is needed). Reduced motion: the wings hold open and it hangs still.
 */
export class RaceButterfly {
  readonly group = new THREE.Group();
  private readonly left: THREE.Mesh;
  private readonly right: THREE.Mesh;

  constructor(parent: THREE.Object3D) {
    const wing = new THREE.PlaneGeometry(0.16, 0.13);
    // Hinged at the body: each wing's inner edge sits on the group's axis.
    wing.translate(0.08, 0, 0);
    const mat = new THREE.MeshBasicMaterial({ color: '#f2d34c', side: THREE.DoubleSide });
    this.right = new THREE.Mesh(wing, mat);
    this.left = new THREE.Mesh(wing, mat);
    this.left.scale.x = -1;
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.12, 0.025),
      new THREE.MeshBasicMaterial({ color: '#3a2440' }),
    );
    for (const m of [this.left, this.right, body]) {
      m.castShadow = false;
      m.receiveShadow = false;
      this.group.add(m);
    }
    this.park();
    parent.add(this.group);
  }

  /** Out of sight but drawn, so the race's warm-up compiles its programs. */
  private park(): void {
    this.group.position.set(0, -50, 0);
  }

  /**
   * Flutter about `face` (a point just in front of the gazing Nubbin's eyes), or park when
   * null. Returns where the butterfly is, for the eyes to follow.
   */
  update(face: THREE.Vector3 | null, nowMs: number, calm: boolean): THREE.Vector3 | null {
    if (!face) {
      this.park();
      return null;
    }
    const t = nowMs / 1000;
    const g = this.group;
    g.position.copy(face);
    if (!calm) {
      g.position.x += Math.sin(t * 3.1) * 0.12;
      g.position.y += Math.sin(t * 5.3) * 0.06;
    }
    // The wings beat about the body's long axis.
    const flap = calm ? 0.5 : 0.25 + Math.abs(Math.sin(t * 22)) * 1.1;
    this.right.rotation.y = -flap;
    this.left.rotation.y = flap;
    g.rotation.z = calm ? 0.3 : 0.3 + Math.sin(t * 2.4) * 0.2;
    return g.position;
  }
}
