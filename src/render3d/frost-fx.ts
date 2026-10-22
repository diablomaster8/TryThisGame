import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { CG_C } from '../config/tuning-c';
import { CG2_W } from '../config/tuning-w';
import { FROST_PX, paintFrostDecal } from '../render/paint/frost-w';
import type { World } from '../sim/types';
import { QuadCloud } from './quad-particles';
import { groveHeight } from './terrain';

/**
 * The cold in 3D (campaign graphics N2, N3): a soft puff of breath every few seconds at
 * each head in the frame, and the Keeper's footprints behind them, capped, in one instanced
 * draw. Breath moves, so it is off under reduced motion; footprints only lie there, so they
 * stay. Both are render-only and read the world.
 */
const WHITE = new THREE.Color('#eaf3ff');
const PRINT = new THREE.Color('#3f4a63');

/** A boot print: a sole and a heel, alpha on transparent, as a texture. */
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

export class FrostFx {
  private readonly breath: QuadCloud;
  private readonly prints: THREE.InstancedMesh | null = null;
  private readonly tex: THREE.Texture | null;
  private placed = 0;
  private cursor = 0;
  private last = { x: Infinity, z: Infinity };
  private side = 1;
  private at = '';
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly up = new THREE.Vector3(0, 1, 0);
  private readonly flat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    -Math.PI / 2,
  );

  constructor(scene: THREE.Scene) {
    this.breath = new QuadCloud(scene, CG_C.breath.heads * 2, 'cpu');
    this.tex = printTexture();
    if (!this.tex) return;
    const mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      color: PRINT,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    });
    this.prints = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(CG_C.prints.size * 0.55, CG_C.prints.size),
      mat,
      CG_C.prints.cap,
    );
    this.prints.count = 0;
    this.prints.frustumCulled = false;
    this.prints.renderOrder = 1;
    scene.add(this.prints);
  }

  update(
    world: World,
    o: { breath: boolean; prints: boolean },
    time: number,
    still: boolean,
  ): void {
    const home = world.location === 'grove';
    const ground = (x: number, z: number): number => (home ? groveHeight(x, z) : 0);
    this.puffs(world, o.breath && !still && world.location !== 'dungeon', time, ground);
    this.trail(world, o.prints, ground);
  }

  private puffs(
    world: World,
    on: boolean,
    time: number,
    ground: (x: number, z: number) => number,
  ): void {
    const b = CG_C.breath;
    if (on) {
      const heads: Array<{ x: number; z: number; f: number; h: number }> = [
        { ...world.keeper.pos, f: world.keeper.facing, h: GROVE3D.keeperHeight * 0.9 },
      ];
      for (const n of world.npcs)
        heads.push({ ...n.pos, f: n.facing, h: GROVE3D.keeperHeight * 0.9 });
      if (world.location === 'grove')
        for (const n of world.nubbins)
          if (n.stage === 'child' || n.stage === 'adult')
            heads.push({ ...n.pos, f: n.facing, h: GROVE3D.nubbinHeight * 0.7 });
      heads.slice(0, b.heads).forEach((p, i) => {
        // Each head breathes on its own beat, so the frame does not puff in step.
        const age = (time + i * 0.83) % b.every;
        if (age > b.life) return;
        const t = age / b.life;
        const fade = Math.sin(Math.PI * Math.min(1, t * 1.2)) * (1 - t);
        this.breath.set(
          p.x + Math.sin(p.f) * (0.12 + t * 0.3),
          ground(p.x, p.z) + p.h + t * 0.28,
          p.z + Math.cos(p.f) * (0.12 + t * 0.3),
          WHITE,
          b.alpha * fade,
          b.size * (0.6 + t * 1.5),
          'dot',
        );
      });
    }
    this.breath.flush();
  }

  private trail(world: World, on: boolean, ground: (x: number, z: number) => number): void {
    const m = this.prints;
    if (!m) return;
    // Prints belong to one place; leaving it clears them.
    if (this.at !== world.location) {
      this.at = world.location;
      this.placed = this.cursor = m.count = 0;
      this.last = { x: Infinity, z: Infinity };
    }
    if (!on) return;
    const { x, z } = world.keeper.pos;
    const dx = x - this.last.x;
    const dz = z - this.last.z;
    const d = Math.hypot(dx, dz);
    if (!(d >= CG_C.prints.stride)) {
      if (this.last.x === Infinity) this.last = { x, z };
      return;
    }
    // Left and right feet, a step apart across the line of travel.
    const yaw = Math.atan2(dx, dz);
    const sx = (dz / d) * 0.11 * this.side;
    const sz = (-dx / d) * 0.11 * this.side;
    this.side = -this.side;
    this.q.setFromAxisAngle(this.up, yaw + Math.PI).multiply(this.flat);
    m.setMatrixAt(
      this.cursor,
      this.m4.compose(
        new THREE.Vector3(x + sx, ground(x, z) + 0.03, z + sz),
        this.q,
        new THREE.Vector3(1, 1, 1),
      ),
    );
    this.cursor = (this.cursor + 1) % CG_C.prints.cap;
    this.placed = Math.min(CG_C.prints.cap, this.placed + 1);
    m.count = this.placed;
    m.instanceMatrix.needsUpdate = true;
    this.last = { x, z };
  }

  dispose(): void {
    this.breath.dispose();
    if (this.prints) {
      this.prints.removeFromParent();
      this.prints.geometry.dispose();
      (this.prints.material as THREE.Material).dispose();
    }
    this.tex?.dispose();
  }
}

/**
 * M14: the Hush's frost on the ground under each lantern it put out, as one instanced draw
 * of grey frost decals that grow from the post and then lie there for the chapter. The
 * growth (0..1 per post) comes from `render/hush-trail.ts`, shared with the pixel view; the
 * decal is the pixel painter's ragged ellipse, softened. Reduced motion arrives already
 * grown, so nothing here moves.
 */
export class FrostDecals {
  private readonly mesh: THREE.InstancedMesh;
  private readonly tex: THREE.CanvasTexture;
  private readonly m4 = new THREE.Matrix4();
  private readonly flat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    -Math.PI / 2,
  );

  constructor(
    scene: THREE.Object3D,
    private readonly posts: ReadonlyArray<{ id: string; x: number; z: number }>,
  ) {
    this.tex = new THREE.CanvasTexture(paintFrostDecal().toCanvas());
    this.tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      color: CG2_W.hush.frostColor,
      transparent: true,
      opacity: CG2_W.hush.frostOpacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    });
    this.mesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, FROST_PX.h / FROST_PX.w),
      mat,
      posts.length,
    );
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
    scene.add(this.mesh);
  }

  /** Lay this frame's decals: the growth of each post by id (absent posts have none). */
  set(grown: ReadonlyMap<string, number>): void {
    let n = 0;
    for (const p of this.posts) {
      const k = grown.get(p.id);
      if (k === undefined || k <= 0.01) continue;
      const e = 1 - (1 - k) * (1 - k);
      const w = CG2_W.hush.frostRadius * 2 * e;
      this.m4.compose(
        new THREE.Vector3(p.x, groveHeight(p.x, p.z) + 0.04, p.z),
        this.flat,
        new THREE.Vector3(w, w, 1),
      );
      this.mesh.setMatrixAt(n++, this.m4);
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.visible = n > 0;
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.tex.dispose();
  }
}
