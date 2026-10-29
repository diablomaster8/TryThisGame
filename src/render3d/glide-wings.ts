/**
 * MOVE-27: the Fly perk's glide in Full 3D: a leaf wing out to each side of the Keeper at
 * shoulder height, beating slowly while the glide holds the fall, as the Pixel view draws
 * them. Two flat quads in one group, shown only while gliding; held level under reduced
 * motion.
 */
import * as THREE from 'three';
import { GLIDE_WINGS } from '../config/tuning-move';

export class GlideWings {
  private readonly root = new THREE.Group();
  private readonly wings: THREE.Mesh[] = [];

  constructor(parent: THREE.Object3D) {
    const W = GLIDE_WINGS;
    const geo = new THREE.CircleGeometry(0.5, 10);
    geo.scale(W.length, W.width, 1);
    geo.translate(W.length * 0.5, 0, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: W.colour,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    for (const side of [1, -1]) {
      const m = new THREE.Mesh(geo, mat);
      m.scale.x = side;
      m.rotation.x = -Math.PI / 2;
      this.wings.push(m);
      this.root.add(m);
    }
    this.root.visible = false;
    parent.add(this.root);
  }

  /** Each frame: where the Keeper is and faces, and whether it glides now. */
  update(on: boolean, x: number, y: number, z: number, facing: number, t: number, calm: boolean) {
    this.root.visible = on;
    if (!on) return;
    this.root.position.set(x, y + GLIDE_WINGS.shoulder, z);
    this.root.rotation.y = facing;
    const beat = calm ? 0 : Math.sin(t * GLIDE_WINGS.beatHz * Math.PI * 2) * GLIDE_WINGS.beat;
    this.wings[0]!.rotation.y = -beat;
    this.wings[1]!.rotation.y = beat;
  }
}
