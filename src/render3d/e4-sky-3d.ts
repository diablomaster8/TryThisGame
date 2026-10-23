import * as THREE from 'three';
import { markAt } from '../config/stage-marks';
import { CG4_E4 } from '../config/tuning-e4';
import { hash01 } from '../render/e4-shared';
import type { Dress3dCtx } from './dressings';
import { groveHeight } from './terrain';

/**
 * K42 and K44 in Full 3D. The rising lanterns are one instanced mesh of tapered paper
 * lanterns, emissive past the bloom threshold, that climb slowly from the festival's ground,
 * sway and thin out at the top (reduced motion hangs a still field in the sky). The day
 * birds and the night moths are one more instanced mesh of tiny two-winged shapes, so the
 * whole package's sky is two draws: dark birds crossing high over the Grove by day, pale
 * moths circling the lamps that are lit at night. Birds and moths never share the daylight,
 * flap by scaling the wings, and hold still (open wings, fixed places) under reduced motion.
 */
function wings(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  // Two triangles, left and right, tips up: a flat V that a scale in y opens and closes.
  const v = [
    0, 0, 0.13, -0.55, 0.16, -0.04, -0.2, 0, -0.14, 0, 0, 0.13, 0.2, 0, -0.14, 0.55, 0.16, -0.04,
  ];
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.computeVertexNormals();
  return g;
}

export class RisingLanterns3d {
  private readonly mesh: THREE.InstancedMesh;
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly pos = new THREE.Vector3();
  private readonly scl = new THREE.Vector3();
  private readonly col = new THREE.Color();

  constructor(ctx: Dress3dCtx) {
    const R = CG4_E4.rising;
    // A paper lantern's belly: narrow at the caps, full at the waist.
    const prof = [
      [0.001, -0.5],
      [0.16, -0.47],
      [0.3, -0.3],
      [0.36, 0],
      [0.3, 0.3],
      [0.16, 0.47],
      [0.001, 0.5],
    ].map(([x, y]) => new THREE.Vector2(x! * R.size * 1.3, y! * R.size * 1.5));
    const geo = new THREE.LatheGeometry(prof, 10);
    const mat = new THREE.MeshBasicMaterial({ toneMapped: false });
    this.mesh = new THREE.InstancedMesh(geo, mat, R.count);
    for (let i = 0; i < R.count; i++) {
      this.col.set(R.colors[i % R.colors.length]!).multiplyScalar(R.glow3d);
      this.mesh.setColorAt(i, this.col);
    }
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.name = 'e4-rising';
    ctx.world3d.add(this.mesh);
    void ctx.compile(this.mesh);
  }

  update(on: boolean, t: number, still: boolean): void {
    const R = CG4_E4.rising;
    if (!on) {
      this.mesh.visible = false;
      return;
    }
    const centre = markAt('grove', 'festival-1') ?? { x: 0.5, z: 2.5, yaw: 0 };
    const shown = still ? R.count : Math.ceil(R.count * Math.min(1, t / R.fadeIn));
    for (let i = 0; i < shown; i++) {
      const a = hash01(i * 2.3) * Math.PI * 2;
      const d = Math.sqrt(hash01(i * 4.1 + 1)) * R.radius;
      const phase = hash01(i * 9.7 + 2);
      const life = still ? R.stillAt : ((t * R.speed) / R.climb + phase) % 1;
      const x = centre.x + Math.cos(a) * d + (still ? 0 : Math.sin(t * 0.7 + i) * R.sway);
      const z = centre.z + Math.sin(a) * d;
      const y = groveHeight(centre.x + Math.cos(a) * d, z) + 1.2 + life * R.climb;
      // Thin out at the bottom and the top by shrinking, so no transparency is needed.
      const s = still ? 1 : Math.min(1, life * 7) * Math.min(1, (1 - life) * 5);
      this.q.setFromAxisAngle(this.pos.set(0, 1, 0), i * 1.7);
      this.pos.set(x, y, z);
      this.scl.setScalar(Math.max(0.001, s));
      this.m4.compose(this.pos, this.q, this.scl);
      this.mesh.setMatrixAt(i, this.m4);
    }
    this.mesh.count = shown;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.visible = shown > 0;
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.mesh.dispose();
  }
}

export class Fauna3d {
  private readonly mesh: THREE.InstancedMesh;
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly pos = new THREE.Vector3();
  private readonly scl = new THREE.Vector3();
  private readonly axis = new THREE.Vector3(0, 1, 0);
  private readonly col = new THREE.Color();
  private time = 0;
  private mode: 'none' | 'day' | 'night' = 'none';

  constructor(
    ctx: Dress3dCtx,
    private readonly posts: ReadonlyArray<{ id: string; x: number; z: number }>,
  ) {
    const F = CG4_E4.fauna;
    const cap = Math.max(F.birds, F.moths * Math.max(4, posts.length));
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false });
    this.mesh = new THREE.InstancedMesh(wings(), mat, cap);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.name = 'e4-fauna';
    ctx.world3d.add(this.mesh);
    void ctx.compile(this.mesh);
  }

  /** `lit` lists the posts whose lamps are lit (moths gather at those only). */
  update(day: boolean, night: boolean, lit: ReadonlySet<string>, dt: number, still: boolean): void {
    this.time += dt;
    const F = CG4_E4.fauna;
    const t = this.time;
    let n = 0;
    const mode = day ? 'day' : night ? 'night' : 'none';
    if (mode !== this.mode) {
      this.mode = mode;
      this.col.set(mode === 'day' ? '#2b2a3a' : '#f2ecd8');
      if (mode === 'night') this.col.multiplyScalar(1.7);
    }
    if (day) {
      for (let i = 0; i < F.birds; i++) {
        const sp = F.birdSpeed[0] + hash01(i + 3) * (F.birdSpeed[1] - F.birdSpeed[0]);
        const y = F.birdY[0] + hash01(i + 9) * (F.birdY[1] - F.birdY[0]);
        const z0 = (hash01(i + 21) - 0.5) * 50;
        const ph = hash01(i + 40) * F.loop * 2;
        const x = still ? (hash01(i + 5) - 0.5) * 36 : ((t * sp + ph) % (F.loop * 2)) - F.loop;
        const flap = still ? 0.8 : 0.35 + 0.65 * Math.abs(Math.sin(t * 5 + i * 1.3));
        this.q.setFromAxisAngle(this.axis, -Math.PI / 2);
        this.pos.set(
          x,
          y + (still ? 0 : Math.sin(t * 0.6 + i) * 0.5),
          z0 + (still ? 0 : Math.sin(t * 0.2 + i) * 3),
        );
        this.scl.set(F.birdSize * 1.4, F.birdSize * flap * 2, F.birdSize * 1.4);
        this.m4.compose(this.pos, this.q, this.scl);
        this.mesh.setMatrixAt(n, this.m4);
        this.mesh.setColorAt(n, this.col);
        n++;
      }
    } else if (night) {
      for (const p of this.posts) {
        if (!lit.has(p.id)) continue;
        const y0 = groveHeight(p.x, p.z) + 2.1;
        for (let m = 0; m < F.moths; m++) {
          const r = F.mothRadius[0] + hash01(p.x * 3 + m) * (F.mothRadius[1] - F.mothRadius[0]);
          const a = hash01(m * 7 + p.z) * Math.PI * 2 + (still ? 0 : t * (0.9 + m * 0.3));
          const flap = still ? 1 : 0.3 + 0.7 * Math.abs(Math.sin(t * F.mothHz * 2 + m * 2));
          this.q.setFromAxisAngle(this.axis, -a);
          this.pos.set(
            p.x + Math.cos(a) * r,
            y0 + (still ? 0 : Math.sin(t * 3 + m) * 0.12) + m * 0.08,
            p.z + Math.sin(a) * r,
          );
          this.scl.set(F.mothSize * 2.2, F.mothSize * 2.2 * flap, F.mothSize * 2.2);
          this.m4.compose(this.pos, this.q, this.scl);
          this.mesh.setMatrixAt(n, this.m4);
          this.mesh.setColorAt(n, this.col);
          n++;
        }
      }
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    this.mesh.visible = n > 0;
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.mesh.dispose();
  }
}
