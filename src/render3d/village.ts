import * as THREE from 'three';
import { fenceSpots } from '../render/scenery';
import type { Tex } from '../samples/aaa-kit';
import type { TownUnlocks } from '../sim/town';
import { bevelBox, buildingMaterial } from './building-kit';

/**
 * The village bits of the home Grove that the pixel view draws in `world-view.ts`: the
 * market stalls that fill the square as prosperity grows (`townUnlocks`: the stall, the
 * attendant's, the festival's, on the pixel spots) and the fence posts that line the main
 * path from the gate to the pond (`fenceSpots`). Stalls follow the pixel painting: two
 * posts, a plank counter, a red and cream striped awning with a scalloped valance, fruit
 * on the counter, bevelled and toon-lit like the houses (art pass 2). Nothing here is
 * tappable, as in the pixel view.
 */
const STALLS: ReadonlyArray<readonly [number, number, keyof TownUnlocks]> = [
  [-12, 17.5, 'stall'],
  [-9.5, 18.5, 'attendant'],
  [-14.5, 18.8, 'festival'],
];

const GOODS = ['#ff9a3a', '#8fd262', '#f2d34c', '#e04a6a'];

export class Village {
  readonly group = new THREE.Group();
  private readonly stalls: THREE.Group[] = [];

  constructor(parent: THREE.Object3D, tex: Tex, ground: (x: number, z: number) => number) {
    this.group.name = 'village';
    parent.add(this.group);
    const wood = buildingMaterial(tex.wood, { color: '#a8784a', normal: 0.4 });
    const dark = buildingMaterial(tex.wood, { color: '#6a4426', normal: 0.4 });
    const trim = new THREE.MeshStandardMaterial({ color: '#d9a76a', roughness: 0.8 });
    const red = new THREE.MeshStandardMaterial({ color: '#c8203c', roughness: 0.75 });
    const cream = new THREE.MeshStandardMaterial({ color: '#f4efe6', roughness: 0.75 });
    const goods = GOODS.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55 }));
    const post = bevelBox(0.13, 2.0, 0.13, 0.03);
    const counter = bevelBox(2.1, 0.8, 0.6, 0.05, 1.2);
    const top = bevelBox(2.24, 0.09, 0.72, 0.03);
    const scallop = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 12, 1, false, 0, Math.PI);
    const stripe = new THREE.BoxGeometry(0.4, 0.04, 1.0);
    const fruit = new THREE.SphereGeometry(0.1, 10, 8);
    for (const [x, z] of STALLS) {
      const s = new THREE.Group();
      const add = (
        geo: THREE.BufferGeometry,
        m: THREE.Material,
        px: number,
        py: number,
        pz: number,
      ) => {
        const o = new THREE.Mesh(geo, m);
        o.position.set(px, py, pz);
        o.castShadow = o.receiveShadow = true;
        s.add(o);
        return o;
      };
      for (const px of [-1.05, 1.05]) add(post, dark, px, 1.0, -0.1);
      add(counter, wood, 0, 0.4, 0);
      add(top, trim, 0, 0.84, 0);
      // The awning: six stripes, alternating, sloping down to the front.
      for (let i = 0; i < 6; i++) {
        const o = add(stripe, i % 2 ? cream : red, -1.0 + i * 0.4, 1.95, 0.05);
        o.rotation.x = 0.35;
        // The valance: a half-round flap hanging off the front edge of each stripe.
        const v = add(scallop, i % 2 ? cream : red, -1.0 + i * 0.4, 1.76, 0.54);
        v.rotation.set(Math.PI / 2, 0, Math.PI / 2);
      }
      for (let i = 0; i < 6; i++) add(fruit, goods[i % 4]!, -0.85 + i * 0.34, 0.98, 0.05);
      s.position.set(x, ground(x, z), z);
      s.visible = false;
      this.group.add(s);
      this.stalls.push(s);
    }
    // Fence posts along the main path, one instanced mesh. On today's layout the gate
    // sits by the pond and `fenceSpots` is empty, so neither view draws any.
    const spots = fenceSpots();
    if (!spots.length) return;
    const posts = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.14, 0.7, 0.14),
      dark,
      spots.length,
    );
    const m4 = new THREE.Matrix4();
    spots.forEach((p, i) =>
      posts.setMatrixAt(i, m4.makeTranslation(p.x, ground(p.x, p.z) + 0.3, p.z)),
    );
    posts.castShadow = posts.receiveShadow = true;
    posts.computeBoundingSphere();
    this.group.add(posts);
  }

  /** Show the stalls the square has unlocked. */
  update(unlocks: TownUnlocks): void {
    STALLS.forEach(([, , key], i) => (this.stalls[i]!.visible = unlocks[key]));
  }
}
