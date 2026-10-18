import * as THREE from 'three';
import { buildTree, pbr, repeatUv, type Tex } from '../samples/aaa-kit';
import { trainerOf } from '../sim/trainers';
import { CrownFade, treeOf } from './crowns';
import { building, decorModel, disposeModel } from './garden';

/**
 * A neighbour's Grove for `visit:<trainer>`: a simple dressed set in place of the bare
 * floor. A grass round the size of the pixel view's visit, three trees, a fence along the
 * front with a gate gap where the Keeper arrives, and the neighbour's house at the back,
 * with its roof in their alignment's colour. House and trees sit outside the camera's
 * orbit round the arrival spot, so the view never ends up inside one. The neighbour's
 * Nubbins and the host come from the crowd; everyone walks on y = 0. Dressed once per
 * trainer and kept until the next neighbour is visited. The trees fade out of the
 * camera's way as the home Grove's do (`crowns`, run by the scene).
 */
export class VisitSet {
  readonly group = new THREE.Group();
  private readonly ground: THREE.Mesh;
  private dressed: THREE.Object3D[] = [];
  private trainer: string | null = null;
  /** The dressed trees' fade, as for the home Grove's (see crowns.ts). */
  readonly crowns = new CrownFade();

  constructor(scene: THREE.Object3D, tex: Tex, pickables: THREE.Object3D[]) {
    const geo = repeatUv(new THREE.CircleGeometry(VISIT_RADIUS, 56), 14, 14);
    this.ground = new THREE.Mesh(geo, pbr(tex.grass, { color: '#d8ffc0', scale: 0.5 }));
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    // Taps on the grass move the Keeper, as on the home ground.
    this.ground.userData.pick = { kind: 'ground', id: 'ground' };
    pickables.push(this.ground);
    this.group.add(this.ground);
    this.group.visible = false;
    scene.add(this.group);
  }

  /** Show the set for a neighbour, or hide it when `trainer` is null. */
  show(trainer: string | null, tex: Tex): void {
    if (!trainer) {
      this.group.visible = false;
      return;
    }
    if (trainer !== this.trainer) {
      this.trainer = trainer;
      this.dress(trainer, tex);
    }
    this.group.visible = true;
  }

  private dress(trainer: string, tex: Tex): void {
    // The last neighbour's set goes for good: its trees, fence and house were made for it.
    for (const o of this.dressed) {
      o.removeFromParent();
      disposeModel(o);
    }
    this.dressed = [];
    this.crowns.clear();
    const flat = () => 0;
    // Three trees, out of the way of where the neighbour's Nubbins wander (|x| < 8, z in -6..8).
    const trees: Array<[number, number, number]> = [
      [-13, -6, 1],
      [13, -9, 2],
      [-12, 12, 3],
    ];
    for (const [x, z, seed] of trees) {
      const parts = buildTree(this.group, tex, x, z, 1.05, seed, flat);
      this.dressed.push(...parts);
      const tree = treeOf(parts);
      if (tree) this.crowns.add(tree);
    }
    // The front fence with a gate gap in the middle, where the Keeper stands on arrival.
    for (let i = -7; i <= 7; i++) {
      if (Math.abs(i) < 1) continue;
      const post = decorModel('fence');
      post.scale.setScalar(FENCE_SCALE);
      post.position.set(i * FENCE_SCALE, 0, FENCE_Z);
      this.group.add(post);
      this.dressed.push(post);
    }
    // The neighbour's house: roof in their alignment's colour, door toward the garden.
    const band = trainerOf(trainer).band;
    const roof = new THREE.MeshStandardMaterial({
      color: band === 'sun' ? '#d8784a' : band === 'moon' ? '#5a4a9a' : '#4a8a5a',
      roughness: 0.8,
    });
    const house = building(6, roof);
    house.position.set(6, 0, -17);
    house.rotation.y = 0.25;
    house.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    this.group.add(house);
    this.dressed.push(house);
  }
}

/** The grass round's radius, past the furthest a neighbour's Nubbin stands. */
const VISIT_RADIUS = 24;
/** The garden fence model is a metre wide and knee high; the boundary fence is bigger. */
const FENCE_SCALE = 1.6;
const FENCE_Z = 13;
