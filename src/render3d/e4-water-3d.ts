import * as THREE from 'three';
import { CG4_E4 } from '../config/tuning-e4';
import type { Streak } from '../render/e4-shared';
import type { Dress3dCtx } from './dressings';
import { WATER_LEVEL } from './terrain';

/**
 * K19 in Full 3D: for each lit lamp within reach of the pond, one stretched emissive card
 * lying on the water, running from the lamp's reflection point toward the viewer, so on the
 * screen it hangs straight down from the lamp the way lamplight does on a still pool. All
 * the cards are one instanced mesh (one draw) with additive light past the bloom threshold;
 * a lamp that is out loses its card, and the pond under ice has none. Reduced motion holds
 * the streaks still (no shimmer).
 */
function streakTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 32;
  const h = 256;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const g = cv.getContext('2d');
  if (!g) return null;
  for (let y = 0; y < h; y++) {
    const t = y / (h - 1);
    // Broken into ripples that thin out away from the lamp.
    const ripple = 0.55 + 0.45 * Math.sin(y * 0.33 + Math.sin(y * 0.07) * 2);
    const a = Math.max(0, (1 - t) ** 1.4) * (0.35 + 0.65 * ripple);
    const half = (w / 2) * (1 - t * 0.55) * (0.7 + 0.3 * ripple);
    const grad = g.createLinearGradient(w / 2 - half, 0, w / 2 + half, 0);
    grad.addColorStop(0, 'rgba(255,200,110,0)');
    grad.addColorStop(0.5, `rgba(255,240,200,${a})`);
    grad.addColorStop(1, 'rgba(255,200,110,0)');
    g.fillStyle = grad;
    g.fillRect(w / 2 - half, y, half * 2, 1);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  // Row 0 is brightest and belongs at the lamp end (the plane's -y end).
  tex.flipY = false;
  return tex;
}

export class Streaks3d {
  private readonly mesh: THREE.InstancedMesh;
  private readonly tex: THREE.CanvasTexture | null;
  private readonly mat: THREE.MeshBasicMaterial;
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly pos = new THREE.Vector3();
  private readonly scl = new THREE.Vector3();
  private readonly dir = new THREE.Vector3();
  private readonly xAxis = new THREE.Vector3();
  private readonly UP = new THREE.Vector3(0, 1, 0);
  private time = 0;

  constructor(ctx: Dress3dCtx) {
    this.tex = streakTexture();
    const g = CG4_E4.streak.glow;
    this.mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      opacity: CG4_E4.streak.opacity,
    });
    this.mat.color.setRGB(g, g * 0.85, g * 0.6);
    this.mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), this.mat, 8);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
    this.mesh.name = 'e4-streaks';
    ctx.world3d.add(this.mesh);
    void ctx.compile(this.mesh);
  }

  /** Place this frame's streaks: `lit` is each anchor's strength (0 hides it). */
  update(
    anchors: ReadonlyArray<{ s: Streak; k: number }>,
    camera: THREE.Camera,
    dt: number,
    still: boolean,
  ): void {
    this.time += dt;
    const S = CG4_E4.streak;
    let n = 0;
    for (const { s, k } of anchors) {
      if (k <= 0 || n >= 8) continue;
      // Toward the viewer along the ground.
      this.dir.set(camera.position.x - s.x, 0, camera.position.z - s.z);
      if (this.dir.lengthSq() < 1e-4) continue;
      this.dir.normalize();
      const len = S.length * 1.15 * k;
      this.xAxis.crossVectors(this.dir, this.UP);
      this.m4.makeBasis(this.xAxis, this.dir, this.UP);
      this.q.setFromRotationMatrix(this.m4);
      const shimmer = still ? 1 : 0.9 + 0.1 * Math.sin(this.time * S.hz * 6.28 + s.x);
      this.pos.set(
        s.x + this.dir.x * (len / 2),
        WATER_LEVEL + S.lift3d,
        s.z + this.dir.z * (len / 2),
      );
      this.scl.set(S.width * 1.3 * shimmer, len, 1);
      this.m4.compose(this.pos, this.q, this.scl);
      this.mesh.setMatrixAt(n++, this.m4);
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.visible = n > 0;
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mat.dispose();
    this.tex?.dispose();
  }
}
