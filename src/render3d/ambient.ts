import * as THREE from 'three';
import { AMBIENT_LIFE } from '../config/tuning-r11d8';
import { WORLD_STREAM } from '../config/tuning-world';
import {
  ambientFor,
  ambientPos,
  BIRD,
  BUTTERFLY,
  FISH,
  STRIDE,
  type AmbientPose,
} from '../render/ambient-life';
import { regionOf } from '../sim/regions';
import type { World } from '../sim/types';

/**
 * R0128 (WORLD-62): ambient life in Full 3D, from the same per-chunk list as the pixel view
 * (`render/ambient-life.ts`). Three instanced meshes (birds, butterflies, fish shadows), so the
 * whole thing is three draw calls and a few hundred triangles whatever is around: one quad per
 * animal, billboarded to the camera, the wings a flapping squash. They are always in the scene
 * (count 0 when nothing is out) so their programs link with the rest, and carry no pick data.
 */
const CAP = 64;

export class AmbientLife3d {
  private readonly birds: THREE.InstancedMesh;
  private readonly flies: THREE.InstancedMesh;
  private readonly fish: THREE.InstancedMesh;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly e = new THREE.Euler();
  private readonly pose: AmbientPose = { x: 0, y: 0, z: 0, yaw: 0, frame: 0, open: 0 };
  /** Animals drawn last frame (the budget test and the debug line read it). */
  drawn = 0;

  constructor(parent: THREE.Object3D) {
    const quad = new THREE.PlaneGeometry(1, 1);
    const flat = new THREE.PlaneGeometry(1, 1);
    flat.rotateX(-Math.PI / 2);
    const mk = (g: THREE.BufferGeometry, color: string, opacity: number, name: string) => {
      const mat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: opacity < 1,
        opacity,
        depthWrite: opacity >= 1,
      });
      const mesh = new THREE.InstancedMesh(g, mat, CAP);
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.name = name;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      parent.add(mesh);
      return mesh;
    };
    this.birds = mk(quad, '#30303a', 1, 'ambient-birds');
    this.flies = mk(quad, '#f6d84a', 1, 'ambient-butterflies');
    this.fish = mk(flat, '#1d3a52', 0.55, 'ambient-fish');
    this.fish.renderOrder = 2;
  }

  update(
    world: World,
    cam: THREE.Vector3,
    tSec: number,
    awake: boolean,
    phone: boolean,
    still: boolean,
    off: boolean,
    groundAt: (x: number, z: number) => number,
  ): void {
    this.drawn = 0;
    let nb = 0;
    let nf = 0;
    let nh = 0;
    const region = regionOf(world.location);
    if (!off && AMBIENT_LIFE.regions[region]) {
      const size = WORLD_STREAM.chunk;
      const cx = Math.floor(world.keeper.pos.x / size);
      const cz = Math.floor(world.keeper.pos.z / size);
      const R = AMBIENT_LIFE.rings;
      for (let dz = -R; dz <= R; dz++)
        for (let dx = -R; dx <= R; dx++) {
          const rec = ambientFor(region, cx + dx, cz + dz, phone);
          for (let i = 0; i < rec.length / STRIDE; i++) {
            const kind = rec[i * STRIDE]!;
            if (kind !== FISH && !awake) continue;
            const pose = this.pose;
            ambientPos(rec, i, tSec, still, pose);
            // Billboard: face the camera about the vertical axis, wings squashing with the flap.
            const yaw = Math.atan2(cam.x - pose.x, cam.z - pose.z);
            if (kind === FISH) {
              this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, pose.yaw);
              this.p.set(pose.x, groundAt(pose.x, pose.z) + 0.06, pose.z);
              this.s.set(0.9, 1, 0.38);
              this.m.compose(this.p, this.q, this.s);
              if (nh < CAP) this.fish.setMatrixAt(nh++, this.m);
            } else {
              const bird = kind === BIRD;
              this.e.set(0, yaw, 0);
              this.q.setFromEuler(this.e);
              this.p.set(pose.x, groundAt(pose.x, pose.z) + pose.y, pose.z);
              const w = bird ? 1 : 0.4;
              this.s.set(w, (bird ? 0.5 : 0.35) * (0.35 + 0.65 * pose.open), 1);
              this.m.compose(this.p, this.q, this.s);
              if (bird && nb < CAP) this.birds.setMatrixAt(nb++, this.m);
              else if (!bird && kind === BUTTERFLY && nf < CAP)
                this.flies.setMatrixAt(nf++, this.m);
            }
          }
        }
    }
    this.drawn = nb + nf + nh;
    for (const [mesh, n] of [
      [this.birds, nb],
      [this.flies, nf],
      [this.fish, nh],
    ] as const) {
      mesh.count = n;
      mesh.instanceMatrix.needsUpdate = n > 0;
      mesh.visible = true;
    }
  }
}
