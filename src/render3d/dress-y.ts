import * as THREE from 'three';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import { CG2_Y } from '../config/tuning-y';
import { LANTERN_POSTS, STORY_B } from '../config/tuning';
import type { Daylight } from '../render/daylight';
import { glowTexture, lanternLights, SceneClock } from '../render/dress-e';
import {
  boardFinal,
  boardFinalTexture,
  firstLightFor,
  hash01,
  lampLevel,
  lanternString,
  shuttersFor,
  stringSegments,
  windowsState,
  type LanternString,
} from '../render/dress-y-shared';
import { stageFlags } from '../render/scene-stage';
import { ddLayout } from '../render/story-b-layout';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { kitMaterials } from './kit-buildings';
import { LAMP_STATE } from './lamp-pool';
import { FIRST_LIGHT } from './sky';
import { groveHeight } from './terrain';

/**
 * Campaign-graphics 2 package y, Full 3D ("light and grade"):
 * - H13, C5: lantern posts and windows that are out give no pool light, no spill and no
 *   glass glow (`LAMP_STATE` for the lamp pool, the spill mesh's vertices for the ground
 *   pools, the window material for the glass). The post states come from `lanternLights`,
 *   the function package e draws its own glass from.
 * - M6: Dawn & Dusk's half cues on the four crest houses (shutter boards, glass, chimney
 *   smoke, dew on the green).
 * - M11: the shared lantern string, one instanced mesh of emissive paper lanterns, a cord
 *   and a few poles; glow is emissive under bloom, no light.
 * - M15: the sky's first-light band and the board's final message.
 * The grade itself (H11, M10) is the campaign look (config/campaign-look.ts), the sky's
 * dawn calm (render3d/sky.ts) and the daylight key (render/daylight.ts).
 */

const SPILL_GRID = 25;
const HIDDEN_Y = -200;

class Dress3dY implements Dressing3d {
  readonly id = 'y';
  private ctx: Dress3dCtx | null = null;
  private clock = new SceneClock();
  private time = 0;
  private root = new THREE.Group();
  private owned: Array<{ dispose(): void }> = [];

  // The host's own pieces, found by what they are.
  private spills: THREE.Mesh | null = null;
  private spillOrig: Float32Array | null = null;
  private spillGroups: Array<{ x: number; z: number; post: number }> = [];
  private spillMask = '';
  private winMat: THREE.MeshPhysicalMaterial | null = null;
  private winTouched = false;

  // Dawn & Dusk.
  private shutters: THREE.InstancedMesh | null = null;
  private slits: THREE.InstancedMesh | null = null;
  private smoke: THREE.Sprite[] = [];
  private dew: THREE.Points[] = [];
  private dewMats: THREE.PointsMaterial[] = [];
  private glassTouched = false;
  private shut = 0;
  private shutKey = '';

  // The lantern string and the board.
  private str: { key: string; group: THREE.Group; owned: Array<{ dispose(): void }> } | null = null;
  private board: THREE.Sprite | null = null;
  private firstLight = 0;
  private readonly dummy = new THREE.Object3D();

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.clock = new SceneClock();
    this.time = 0;
    this.root = new THREE.Group();
    this.root.name = 'dress-y';
    this.owned = [];
    this.spills = null;
    this.winMat = null;
    this.str = null;
    this.board = null;
    this.firstLight = 0;
    this.buildHalves();
    ctx.world3d.add(this.root);
    void ctx.compile(this.root);
  }

  /** Shutter boards and slits, chimney smoke and dew: built once, shown by the half. */
  private buildHalves(): void {
    const H = CG2_Y.halves;
    const board = new THREE.BoxGeometry(H.shutter.w, H.shutter.h, 0.06);
    const slit = new THREE.BoxGeometry(0.1, H.shutter.h * 0.82, 0.02);
    const wood = new THREE.MeshStandardMaterial({ color: H.shutter.color, roughness: 0.85 });
    const glow = new THREE.MeshBasicMaterial({ color: H.shutter.slit, toneMapped: false });
    glow.color.multiplyScalar(CG2_Y.string.emissive);
    this.owned.push(board, slit, wood, glow);
    this.shutters = new THREE.InstancedMesh(board, wood, 8);
    this.slits = new THREE.InstancedMesh(slit, glow, 8);
    for (const m of [this.shutters, this.slits]) {
      m.frustumCulled = false;
      m.visible = false;
      m.count = 0;
      this.root.add(m);
    }
    const puff = glowTexture();
    this.owned.push(puff);
    for (let i = 0; i < H.smoke.puffs; i++) {
      const mat = new THREE.SpriteMaterial({
        map: puff,
        color: '#d9dce6',
        transparent: true,
        depthWrite: false,
        opacity: 0,
      });
      this.owned.push(mat);
      const s = new THREE.Sprite(mat);
      s.visible = false;
      this.smoke.push(s);
      this.root.add(s);
    }
    const D = H.dew;
    for (let set = 0; set < 2; set++) {
      const n = Math.floor(D.count / 2);
      const pos = new Float32Array(n * 3);
      const L = ddLayout();
      for (let i = 0; i < n; i++) {
        const k = i * 2 + set;
        const a = hash01(k * 3.1) * Math.PI * 2;
        const r = Math.sqrt(hash01(k * 7.7 + 1)) * L.radius * D.radiusShare * 2;
        const x = L.centre.x + Math.cos(a) * r;
        const z = L.centre.z + Math.sin(a) * r;
        pos.set([x, groveHeight(x, z) + 0.07, z], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        map: puff,
        color: '#ffffff',
        size: D.size * 2,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
        fog: true,
      });
      this.owned.push(geo, mat);
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      pts.visible = false;
      this.dew.push(pts);
      this.dewMats.push(mat);
      this.root.add(pts);
    }
  }

  /** The spill mesh and the window glass, found by what they are the first time. */
  private findHost(ctx: Dress3dCtx): void {
    if (!this.spills) {
      const spills = ctx.world3d.getObjectByName('light-spills') as THREE.Mesh | undefined;
      if (spills?.geometry) {
        this.spills = spills;
        const pos = spills.geometry.getAttribute('position') as THREE.BufferAttribute;
        this.spillOrig = new Float32Array(pos.array as Float32Array);
        this.spillGroups = [];
        for (let g = 0; g + SPILL_GRID <= pos.count; g += SPILL_GRID) {
          let x = 0;
          let z = 0;
          for (let i = 0; i < SPILL_GRID; i++) {
            x += pos.getX(g + i);
            z += pos.getZ(g + i);
          }
          x /= SPILL_GRID;
          z /= SPILL_GRID;
          const post = LANTERN_POSTS.findIndex(
            (p) => Math.hypot(p.x - x, p.z - z) < CG2_Y.lamp.postRadius,
          );
          this.spillGroups.push({ x, z, post });
        }
      }
    }
    if (!this.winMat) {
      ctx.world3d.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial | undefined;
        if (
          !this.winMat &&
          m &&
          !Array.isArray(m) &&
          m.isMeshPhysicalMaterial &&
          m.clearcoat === 1 &&
          m.color.getHex() === 0x9ad0ff
        )
          this.winMat = m;
      });
    }
  }

  /** Collapse the ground pools of the posts and windows that are out; restore the rest. */
  private setSpills(postOut: readonly boolean[], windowsOut: boolean): void {
    const mesh = this.spills;
    if (!mesh || !this.spillOrig) return;
    const key = `${postOut.map((b) => (b ? 1 : 0)).join('')}|${windowsOut ? 1 : 0}`;
    if (key === this.spillMask) return;
    this.spillMask = key;
    const pos = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    this.spillGroups.forEach((g, gi) => {
      const out = g.post >= 0 ? !!postOut[g.post] : windowsOut;
      const at = gi * SPILL_GRID;
      for (let i = 0; i < SPILL_GRID; i++) {
        const k = (at + i) * 3 + 1;
        arr[k] = out ? HIDDEN_Y : this.spillOrig![k]!;
      }
    });
    pos.needsUpdate = true;
  }

  update(world: World, stage: SceneStage, _daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const flags = stageFlags(world, stage);
    const home = flags.location === 'grove';
    this.time += dt;
    const sceneT = this.clock.tick(flags.sceneId, dt);
    this.findHost(ctx);

    // H13, C5: which posts and windows are out, flickering or lit.
    const states = home ? lanternLights(flags, stage, sceneT, reduce) : {};
    const win = home ? windowsState(flags, stage) : null;
    const levels = LANTERN_POSTS.map((p) => lampLevel(states[p.id], this.time, reduce));
    LAMP_STATE.posts = LANTERN_POSTS.map((p, i) => ({ x: p.x, z: p.z, level: levels[i]! }));
    LAMP_STATE.windows = win === 'out' ? 0 : 1;
    LAMP_STATE.radius = CG2_Y.lamp.postRadius;
    this.setSpills(
      levels.map((l) => l <= 0),
      win === 'out',
    );
    if (this.winMat) {
      if (win === 'out') {
        this.winMat.emissiveIntensity = 0;
        this.winTouched = true;
      } else if (this.winTouched) {
        this.winMat.emissiveIntensity = ctx.lampsOn() ? CG2_Y.windows.lit : 0;
        this.winTouched = false;
      }
    }

    this.halves(ctx, flags, stage, reduce, dt);
    this.lanterns(ctx, flags, stage);

    // M15: first light on the sky, the final message on the board.
    const goal = home ? firstLightFor(stage) : 0;
    this.firstLight = reduce
      ? goal
      : this.firstLight + Math.max(-dt * 0.8, Math.min(dt * 0.8, goal - this.firstLight));
    FIRST_LIGHT.value = this.firstLight;
    this.finalBoard(ctx, home && boardFinal(stage));
  }

  /** M6: shutters, glass, smoke and dew for the half. */
  private halves(
    ctx: Dress3dCtx,
    flags: ReturnType<typeof stageFlags>,
    stage: SceneStage,
    reduce: boolean,
    dt: number,
  ): void {
    const H = CG2_Y.halves;
    const half = flags.location === 'grove' && !stage.exclusive ? flags.half : null;
    const glass = kitMaterials(ctx.tex).glass as THREE.MeshStandardMaterial;
    if (half) {
      glass.emissiveIntensity = half === 'dusk' ? CG2_Y.windows.duskGlass : CG2_Y.windows.dawnGlass;
      this.glassTouched = true;
    } else if (this.glassTouched) {
      glass.emissiveIntensity = CG2_Y.windows.kitGlass;
      this.glassTouched = false;
    }
    const sh = this.shutters;
    const sl = this.slits;
    if (!sh || !sl) return;
    for (const m of [sh, sl]) m.visible = half !== null;
    for (const s of this.smoke) s.visible = half === 'dawn';
    for (const p of this.dew) p.visible = half === 'dawn';
    if (!half) return;

    // Shutters ease toward the half's state; a new scene starts them at the other one, so
    // the dawn's open and the dusk's close both play as the scene begins.
    const goal = shuttersFor(flags, stage) === 'shut' ? 1 : 0;
    const key = `${flags.sceneId}|${goal}`;
    if (key !== this.shutKey) {
      this.shutKey = key;
      this.shut = reduce ? goal : 1 - goal;
    }
    const step = dt / H.shutter.seconds;
    this.shut = reduce ? goal : this.shut + Math.max(-step, Math.min(step, goal - this.shut));
    const c = this.shut;
    const L = ddLayout();
    const D = STORY_B.dawnDusk;
    let n = 0;
    L.houses.forEach((h, i) => {
      const spec = D.houses[i];
      if (!spec) return;
      const w = spec.w;
      const d = w * 0.74;
      const hh = w * 0.62;
      const cs = Math.cos(h.yaw);
      const sn = Math.sin(h.yaw);
      for (const sx of [-1, 1]) {
        const lx = sx * w * H.window.dx;
        const lz = d / 2 + 0.12;
        const x = h.x + lx * cs + lz * sn;
        const z = h.z - lx * sn + lz * cs;
        const wy = groveHeight(h.x, h.z) + hh * H.window.dy;
        const top = wy + H.shutter.h / 2;
        for (const [mesh, k, depth] of [
          [sh, 1, 0],
          [sl, 0.82, 0.05],
        ] as const) {
          const o = this.dummy;
          o.position.set(x + depth * sn, top - (H.shutter.h * k * c) / 2, z + depth * cs);
          o.rotation.set(0, h.yaw, 0);
          o.scale.set(1, Math.max(0.001, c), 1);
          o.updateMatrix();
          mesh.setMatrixAt(n, o.matrix);
        }
        n++;
      }
    });
    sh.count = sl.count = n;
    sh.instanceMatrix.needsUpdate = sl.instanceMatrix.needsUpdate = true;
    // Slits glow only when the boards are shut at dusk; dawn's boards are bare.
    sl.visible = half === 'dusk';

    if (half === 'dawn') {
      // Dew: two sets of glints that take turns; still, and half bright, when reduced.
      const D2 = H.dew;
      this.dewMats.forEach((m, i) => {
        const k = reduce ? 0.7 : 0.15 + 0.85 * Math.abs(Math.sin(this.time * D2.hz * 2 + i * 1.7));
        m.opacity = D2.opacity * k * (reduce && i === 1 ? 0 : 1);
      });
      // Smoke from one chimney: a column of puffs that rise and thin; three still when reduced.
      const hs = L.houses[H.smoke.house];
      const spec = D.houses[H.smoke.house];
      if (hs && spec) {
        const base = groveHeight(hs.x, hs.z) + spec.w * 0.62 * 1.55;
        const S = H.smoke;
        this.smoke.forEach((s, i) => {
          const phase = reduce
            ? (i + 0.5) / (S.puffs + 1)
            : (this.time / S.seconds + i / S.puffs) % 1;
          const fade = Math.sin(Math.PI * Math.min(1, phase * 1.15));
          s.position.set(hs.x + 0.9 + phase * 0.9, base + phase * S.rise, hs.z + 0.2);
          s.scale.setScalar(S.size * (0.5 + phase));
          s.material.opacity = S.opacity * fade;
        });
      }
    }
  }

  /** M11: the lantern string, built when the stage first asks for it and kept hidden after. */
  private lanterns(ctx: Dress3dCtx, flags: ReturnType<typeof stageFlags>, stage: SceneStage): void {
    const str =
      flags.location === 'grove' && !stage.exclusive
        ? lanternString(flags, stage, groveHeight)
        : null;
    if (this.str && (!str || str.key !== this.str.key)) this.str.group.visible = false;
    if (!str) return;
    if (!this.str || this.str.key !== str.key) {
      if (this.str) this.dropString();
      this.str = this.buildString(ctx, str);
    }
    this.str.group.visible = true;
  }

  private dropString(): void {
    if (!this.str) return;
    this.str.group.removeFromParent();
    for (const o of this.str.owned) o.dispose();
    this.str = null;
  }

  private buildString(
    ctx: Dress3dCtx,
    str: LanternString,
  ): { key: string; group: THREE.Group; owned: Array<{ dispose(): void }> } {
    const S = CG2_Y.string;
    const group = new THREE.Group();
    group.name = 'lantern-string';
    const owned: Array<{ dispose(): void }> = [];
    const poleGeo = new THREE.CylinderGeometry(0.045, 0.065, S.poleHeight, 6);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#5a3c28', roughness: 0.9 });
    const poles = new THREE.InstancedMesh(poleGeo, poleMat, str.poles.length);
    str.poles.forEach((p, i) => {
      this.dummy.position.set(p.x, p.y + S.poleHeight / 2, p.z);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.scale.setScalar(1);
      this.dummy.updateMatrix();
      poles.setMatrixAt(i, this.dummy.matrix);
    });
    const seg = stringSegments(str);
    const cordGeo = new THREE.BufferGeometry().setFromPoints(
      seg.map((p) => new THREE.Vector3(p.x, p.y, p.z)),
    );
    const cord = new THREE.LineSegments(cordGeo, new THREE.LineBasicMaterial({ color: '#3a2a1c' }));
    const lampGeo = new THREE.SphereGeometry(S.size, 10, 8);
    const lampMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    const lamps = new THREE.InstancedMesh(lampGeo, lampMat, str.lamps.length);
    const col = new THREE.Color();
    str.lamps.forEach((p, i) => {
      this.dummy.position.set(p.x, p.y - S.size * 0.5, p.z);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.scale.set(1, 1.3, 1);
      this.dummy.updateMatrix();
      lamps.setMatrixAt(i, this.dummy.matrix);
      col.set(S.colors[i % S.colors.length]!).multiplyScalar(S.emissive);
      lamps.setColorAt(i, col);
    });
    for (const m of [poles, lamps]) m.frustumCulled = false;
    cord.frustumCulled = false;
    group.add(poles, cord, lamps);
    owned.push(poleGeo, poleMat, cordGeo, cord.material as THREE.Material, lampGeo, lampMat);
    ctx.world3d.add(group);
    void ctx.compile(group);
    return { key: str.key, group, owned };
  }

  /** M15: the board's final message, a card bigger than the board and a little in front. */
  private finalBoard(ctx: Dress3dCtx, want: boolean): void {
    if (this.board) this.board.visible = false;
    if (!want) return;
    const m = markAt('grove', 'board');
    if (!m) return;
    const B = CG2_Y.firstLight.board;
    if (!this.board) {
      const tex = boardFinalTexture();
      const mat = new THREE.SpriteMaterial({ map: tex, toneMapped: false, fog: false });
      mat.color.setScalar(1.3);
      this.owned.push(tex, mat);
      this.board = new THREE.Sprite(mat);
      this.board.scale.set(B.w, B.h, 1);
      this.root.add(this.board);
      void ctx.compile(this.board);
    }
    this.board.position.set(
      m.x + Math.sin(m.yaw) * B.forward,
      groveHeight(m.x, m.z) + B.lift,
      m.z + Math.cos(m.yaw) * B.forward,
    );
    this.board.visible = true;
  }

  dispose(): void {
    LAMP_STATE.posts = [];
    LAMP_STATE.windows = 1;
    FIRST_LIGHT.value = 0;
    this.dropString();
    this.root.removeFromParent();
    for (const o of this.owned) o.dispose();
    this.owned = [];
    this.ctx = null;
  }
}

export const dress3dY: Dressing3d = new Dress3dY();
