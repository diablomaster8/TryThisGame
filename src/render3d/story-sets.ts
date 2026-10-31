import * as THREE from 'three';
import { C, color } from '../render/sprites/palette';
import { pbr, repeatUv, type Tex } from '../samples/aaa-kit';
import type { Location } from '../sim/types';
import { CG_C } from '../config/tuning-c';
import { OCCLUDE_R10 } from '../config/tuning-move-r10b';
import { occluders } from './occluders';
import {
  buildBackdrop,
  buildCorvinHouse,
  buildGreyGate,
  buildHollowCamp,
  frostify,
} from './story-places';

/**
 * The campaign's two story places in 3D, after the pixel scene's `buildHollow` and
 * `buildCorvin` (`render/grove-scene.ts`), on the same spots: the Hollow is a dark wood past
 * the falls (eighteen round-crowned trees and the flat stone where the notebook waits),
 * Corvin's garden is three square pens of pale fence with nothing growing. The floors take
 * the pixel view's ground tints there: deep green grass, and bare earth in lilac grey.
 * Instanced, so each place costs a handful of draw calls; everyone walks on y = 0.
 */
const HOLLOW_TREES: ReadonlyArray<readonly [number, number, number]> = [
  [-13, -13, 1.3],
  [-6, -13, 1.1],
  [1, -13, 1.4],
  [8, -12, 1.2],
  [13, -9, 1.3],
  [-13, -5, 1.2],
  [13, -2, 1.1],
  [-13, 3, 1.4],
  [13, 5, 1.2],
  [-12, 11, 1.1],
  [-5, 13, 1.3],
  [3, 13, 1.1],
  [10, 12, 1.4],
  [-8, -6, 1.0],
  [7, -6, 1.2],
  [-3, 8, 1.1],
  [9, 4, 1.0],
  [-9, 4, 1.2],
];

/** A crown's four lobes: offset from the trunk's foot and size, as the pixel trees. */
const LOBES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 3.6, 0, 1.7],
  [1.1, 3.0, 0.4, 1.1],
  [-1.0, 3.1, -0.4, 1.1],
  [0.2, 4.6, 0.3, 1.0],
];

/** Corvin's pens: x, z of a corner, width and depth. */
const PENS: ReadonlyArray<readonly [number, number, number, number]> = [
  [-10, -7.5, 20, 3],
  [-10, -4.5, 20, 3],
  [-10, -1.5, 20, 3],
];

export class StorySets {
  /** Whether Corvin's house's fade box is registered (R0018). */
  private corvinBox = false;
  private readonly floor: THREE.Mesh;
  private readonly grass: THREE.MeshStandardMaterial;
  private readonly earth: THREE.MeshStandardMaterial;
  private readonly hollow = new THREE.Group();
  private readonly corvin = new THREE.Group();

  constructor(scene: THREE.Object3D, tex: Tex, pickables: THREE.Object3D[]) {
    this.grass = pbr(tex.grass, { color: color(C.deepGreen), scale: 0.5 });
    this.earth = frostify(pbr(tex.dirt, { color: color(C.lilacGrey), scale: 0.6 }));
    // Wide enough that its edge sits in the fog from anywhere the Keeper can stand.
    this.floor = new THREE.Mesh(repeatUv(new THREE.PlaneGeometry(120, 120), 44, 44), this.grass);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.floor.userData.pick = { kind: 'ground', id: 'ground' };
    this.floor.visible = false;
    pickables.push(this.floor);
    scene.add(this.floor, this.hollow, this.corvin);
    this.buildHollow(tex);
    this.buildCorvin();
    // Campaign graphics C8 and H5: the camp, the backdrop, the house and the gate.
    this.hollow.add(buildHollowCamp());
    const house = buildCorvinHouse().group;
    this.corvin.add(buildBackdrop(), house, buildGreyGate());
    // R0018: Corvin's house thins out when it hides the Keeper, as the Grove's houses do.
    occluders.patch(house);
    this.hollow.visible = this.corvin.visible = false;
  }

  /** Show the set for `place` (the floor too); every other place hides both. */
  show(place: Location): void {
    const hollow = place === 'hollow';
    const corvin = place === 'corvin';
    this.hollow.visible = hollow;
    // R0018: Corvin's house's fade box stands only while his garden is up.
    if (corvin !== this.corvinBox) {
      this.corvinBox = corvin;
      occluders.clear('story');
    }
    if (corvin && !occluders.has('story')) {
      const h = CG_C.corvin.house;
      const pad = OCCLUDE_R10.housePad;
      // The roof overhangs the walls by 0.45 a side and 0.35 front and back (story-places).
      occluders.add(
        'story',
        h.x,
        h.z,
        h.w / 2 + 0.45 + pad,
        h.d / 2 + 0.35 + pad,
        -0.2,
        h.h * 1.55 + 0.5,
        h.h,
      );
    }
    this.corvin.visible = corvin;
    this.floor.visible = hollow || corvin;
    this.floor.material = corvin ? this.earth : this.grass;
  }

  /** Whether a story set is up (then the plain dungeon floor stays hidden). */
  get showing(): boolean {
    return this.floor.visible;
  }

  private buildHollow(tex: Tex): void {
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const trunks = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.35, 0.6, 3.2, 7),
      pbr(tex.bark, { color: '#8a7a6a', scale: 1 }),
      HOLLOW_TREES.length,
    );
    const lobes = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshStandardMaterial({
        color: color(C.deepGreen),
        roughness: 0.95,
        flatShading: true,
      }),
      HOLLOW_TREES.length * LOBES.length,
    );
    HOLLOW_TREES.forEach(([x, z, s], i) => {
      const turn = i * 0.9;
      q.setFromAxisAngle(up, turn);
      trunks.setMatrixAt(
        i,
        m4.compose(new THREE.Vector3(x, 1.6, z), q, new THREE.Vector3(1, 1, 1)),
      );
      LOBES.forEach(([dx, dy, dz, ls], j) => {
        // The lobe offsets turn with the tree, as the pixel tree's group does.
        const off = new THREE.Vector3(dx, dy, dz).applyAxisAngle(up, turn);
        const size = new THREE.Vector3(ls * s, ls * s * 0.85, ls * s);
        lobes.setMatrixAt(
          i * LOBES.length + j,
          m4.compose(off.add(new THREE.Vector3(x, 0, z)), q, size),
        );
      });
    });
    for (const m of [trunks, lobes]) {
      m.castShadow = true;
      m.receiveShadow = true;
      m.computeBoundingSphere();
    }
    const stone = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.5, 1.8),
      pbr(tex.rock, { color: color(C.greyLight), scale: 1 }),
    );
    stone.position.set(-9, 0.25, -9);
    stone.rotation.y = 0.4;
    stone.castShadow = stone.receiveShadow = true;
    this.hollow.add(trunks, lobes, stone);
  }

  private buildCorvin(): void {
    const posts: THREE.Matrix4[] = [];
    const rails: THREE.Matrix4[] = [];
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const edge = (ax: number, az: number, bx: number, bz: number, gate = false) => {
      const len = Math.hypot(bx - ax, bz - az);
      const n = Math.max(1, Math.round(len / 2));
      q.setFromAxisAngle(up, Math.atan2(bx - ax, bz - az) + Math.PI / 2);
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        // A gated wall (campaign graphics H15) keeps only its corner posts: the leaf swings there.
        if (gate) {
          if (i === 0 || i === n)
            posts.push(
              new THREE.Matrix4().makeTranslation(ax + (bx - ax) * t, 0.5, az + (bz - az) * t),
            );
          continue;
        }
        posts.push(
          new THREE.Matrix4().makeTranslation(ax + (bx - ax) * t, 0.5, az + (bz - az) * t),
        );
        if (i === n) continue;
        const mid = new THREE.Vector3(
          ax + (bx - ax) * (t + 0.5 / n),
          0,
          az + (bz - az) * (t + 0.5 / n),
        );
        for (const y of [0.35, 0.8])
          rails.push(
            new THREE.Matrix4().compose(
              mid.clone().setY(y),
              q,
              new THREE.Vector3(len / n / 2, 1, 1),
            ),
          );
      }
    };
    for (const [x0, z0, w, d] of PENS) {
      edge(x0, z0, x0 + w, z0);
      edge(x0, z0 + d, x0 + w, z0 + d);
      edge(x0, z0, x0, z0 + d);
      edge(x0 + w, z0, x0 + w, z0 + d, true);
    }
    const mat = new THREE.MeshStandardMaterial({ color: color(C.lilacGrey), roughness: 0.85 });
    const make = (geo: THREE.BufferGeometry, list: THREE.Matrix4[]) => {
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((x, i) => m.setMatrixAt(i, x));
      m.castShadow = m.receiveShadow = true;
      m.computeBoundingSphere();
      this.corvin.add(m);
    };
    make(new THREE.BoxGeometry(0.16, 1.0, 0.16), posts);
    make(new THREE.BoxGeometry(2, 0.12, 0.12), rails);
  }
}
