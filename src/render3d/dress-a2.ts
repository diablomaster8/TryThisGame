import * as THREE from 'three';
import type { SceneStage } from '../config/story';
import { CG4_A2 } from '../config/tuning-a2';
import type { Daylight } from '../render/daylight';
import { stageFlags } from '../render/scene-stage';
import { StageTracker } from '../render/stage-actors';
import { groundType } from '../render/walk-on';
import { PrintTrail, type Print } from '../render/walk-prints';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { groveHeight } from './terrain';

/**
 * Campaign graphics 4, package a2, Full 3D: the footprints walk-ons leave on snow, mud and
 * sand (K36), as one instanced draw of flat boot prints tinted by the ground. The walk-ons
 * (K5) and the partner's reactions (K40) live in the shared stager both renderers read; this
 * dressing only watches who is mid-stride. Under reduced motion no one walks, so none lie.
 */

/** A boot print: a sole and a heel, white on transparent, tinted per instance. */
function printTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = 32;
  cv.height = 64;
  const g = cv.getContext('2d');
  if (!g) return null;
  g.fillStyle = '#fff';
  g.beginPath();
  g.ellipse(16, 20, 10, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(16, 51, 7, 9, 0, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(cv);
  t.magFilter = THREE.NearestFilter;
  return t;
}

const COLORS = [CG4_A2.prints.snow.color, CG4_A2.prints.mud.color, CG4_A2.prints.sand.color].map(
  (c) => new THREE.Color(c),
);
const GROUND = { snow: 0, mud: 1, sand: 2 } as const;

class Dress3dA2 implements Dressing3d {
  readonly id = 'a2';
  private ctx: Dress3dCtx | null = null;
  private mesh: THREE.InstancedMesh | null = null;
  private tex: THREE.Texture | null = null;
  private tracker = new StageTracker();
  private readonly trail = new PrintTrail();
  private count = 0;
  private cursor = 0;
  private loc = '';
  private scene = '';
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly up = new THREE.Vector3(0, 1, 0);
  private readonly flat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    -Math.PI / 2,
  );

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.tracker = new StageTracker();
    this.trail.reset();
    this.count = this.cursor = 0;
    this.loc = this.scene = '';
    this.tex = printTexture();
    if (!this.tex) return;
    const P = CG4_A2.prints;
    const mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      transparent: true,
      opacity: P.opacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    });
    const mesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(P.size * 0.55, P.size),
      mat,
      P.cap,
    );
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;
    // The colour attribute exists from the start, so the first print does not recompile.
    mesh.setColorAt(0, COLORS[0]!);
    this.mesh = mesh;
    ctx.scene.add(mesh);
    void ctx.compile(mesh);
  }

  update(world: World, stage: SceneStage, _daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    const mesh = this.mesh;
    if (!ctx || !mesh) return;
    const tracker = this.tracker;
    tracker.tick(world, dt);
    const id = tracker.stager.id;
    if (world.location !== this.loc || (id && id !== this.scene)) {
      this.count = this.cursor = mesh.count = 0;
      this.trail.reset();
    }
    this.loc = world.location;
    if (id) this.scene = id;
    const g = groundType(stageFlags(world, tracker.stage));
    if (g && !ctx.reduceMotion()) {
      const home = world.location === 'grove';
      for (const p of this.trail.feed(tracker.stager.walkers, GROUND[g])) {
        this.lay(p, home ? groveHeight(p.x, p.z) : 0);
      }
    }
    mesh.visible = mesh.count > 0;
    void stage;
  }

  private lay(p: Print, y: number): void {
    const m = this.mesh!;
    this.q.setFromAxisAngle(this.up, p.yaw + Math.PI).multiply(this.flat);
    m.setMatrixAt(
      this.cursor,
      this.m4.compose(new THREE.Vector3(p.x, y + 0.03, p.z), this.q, new THREE.Vector3(1, 1, 1)),
    );
    m.setColorAt(this.cursor, COLORS[p.ground]!);
    this.cursor = (this.cursor + 1) % CG4_A2.prints.cap;
    this.count = Math.min(CG4_A2.prints.cap, this.count + 1);
    m.count = this.count;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }

  dispose(): void {
    if (this.mesh) {
      this.mesh.removeFromParent();
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
      this.mesh.dispose();
    }
    this.tex?.dispose();
    this.mesh = null;
    this.tex = null;
    this.ctx = null;
  }
}

export const dress3dA2: Dressing3d = new Dress3dA2();
