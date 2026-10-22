import * as THREE from 'three';
import { LOOK_STATE, storyId } from '../config/npc-looks';
import type { SceneStage } from '../config/story';
import { GROVE3D } from '../config/tuning';
import { HAND_LANTERN } from '../config/tuning-e';
import { CG4_B4 } from '../config/tuning-b4';
import type { Daylight } from '../render/daylight';
import { nextMemorial } from '../render/dress-b4';
import { stageFlags } from '../render/scene-stage';
import { StageTracker } from '../render/stage-actors';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { memorialFlower } from './memorial';
import { groveHeight } from './terrain';
import { brightHull } from './toon-outline';

/**
 * Campaign graphics 4, package b4, Full 3D ("people"):
 * - K11, K38: `LOOK_STATE` (the tale and Hazel's age, which `storyId` reads for the look
 *   keys); the tale's grade is the campaign look 'tale' (config/campaign-look.ts), laid over
 *   the frame by the shared screen layers. Hazel's stick is drawn at her hand.
 * - K14: the speaking actor gets a 1-draw pale contact ring under the feet and a brighter
 *   toon outline step (the hulls of the rig standing there swap to the speaker's material).
 *   The chevron (package p) pairs with both, so it is never colour alone.
 * - K37: a separate campaign's departure: a soft pale cocoon fading at the campaign's memorial
 *   spot, then the flower growing there on the scene's last line.
 * The look keys and Fern's story look are in config/npc-looks.ts and render3d/looks.ts.
 */

type Hull = THREE.Mesh;

class Dress3dB4 implements Dressing3d {
  readonly id = 'b4';
  private ctx: Dress3dCtx | null = null;
  private root = new THREE.Group();
  private tracker = new StageTracker();
  private owned: Array<{ dispose(): void }> = [];
  private ring: THREE.Mesh | null = null;
  private stick: THREE.Mesh | null = null;
  private cocoon: THREE.Group | null = null;
  private cocoonMat: THREE.MeshBasicMaterial | null = null;
  private flower: THREE.Group | null = null;
  private flowerT = 0;
  private lit: Hull[] = [];
  private litId: string | null = null;
  private scanIn = 0;

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.root = new THREE.Group();
    this.root.name = 'dress-b4';
    this.tracker = new StageTracker();
    this.owned = [];
    this.lit = [];
    this.litId = null;
    this.scanIn = 0;
    this.flowerT = 0;
    const R = CG4_B4.ring;

    // K14: the contact ring, one draw, flat on the ground.
    const rg = new THREE.RingGeometry(R.inner, R.outer, 40);
    rg.rotateX(-Math.PI / 2);
    const rm = new THREE.MeshBasicMaterial({
      color: R.color,
      transparent: true,
      opacity: R.opacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      fog: false,
    });
    this.ring = new THREE.Mesh(rg, rm);
    this.ring.renderOrder = 3;
    this.ring.visible = false;
    this.ring.raycast = () => {};
    this.root.add(this.ring);

    // K38: Hazel's stick, a thin cylinder standing on the ground, leaning a little.
    const H = CG4_B4.hazel;
    const sg = new THREE.CylinderGeometry(0.018, 0.024, GROVE3D.keeperHeight * H.stick.height, 6);
    sg.translate(0, (GROVE3D.keeperHeight * H.stick.height) / 2, 0);
    const sm = new THREE.MeshLambertMaterial({ color: '#7a5232' });
    this.stick = new THREE.Mesh(sg, sm);
    this.stick.visible = false;
    this.stick.raycast = () => {};
    this.root.add(this.stick);

    // K37: a soft pale cocoon: an ellipsoid wound with three pale threads.
    const D = CG4_B4.departure;
    const cm = new THREE.MeshBasicMaterial({
      color: '#d8d4e6',
      transparent: true,
      opacity: D.cocoonOpacity,
      depthWrite: false,
      fog: false,
    });
    this.cocoonMat = cm;
    const body = new THREE.SphereGeometry(1, 16, 12);
    body.scale(0.3, 0.44, 0.3);
    body.translate(0, 0.46, 0);
    const bodyMesh = new THREE.Mesh(body, cm);
    this.cocoon = new THREE.Group();
    this.cocoon.add(bodyMesh);
    for (let i = 0; i < 3; i++) {
      const t = new THREE.TorusGeometry(0.28 - Math.abs(i - 1) * 0.05, 0.012, 5, 18);
      t.rotateX(Math.PI / 2);
      t.translate(0, 0.28 + i * 0.18, 0);
      this.cocoon.add(new THREE.Mesh(t, cm));
    }
    this.cocoon.visible = false;
    this.cocoon.traverse((o) => ((o as THREE.Mesh).raycast = () => {}));
    this.root.add(this.cocoon);
    this.owned.push(rg, rm, sg, sm, cm, body);

    ctx.scene.add(this.root);
    void ctx.compile(this.root);
  }

  /** The rig groups standing within the ring radius of (x, z), by their look key. */
  private rigsAt(root: THREE.Object3D, x: number, z: number, out: THREE.Object3D[]): void {
    const p = new THREE.Vector3();
    const walk = (o: THREE.Object3D): void => {
      if (o.userData.lookKey) {
        o.getWorldPosition(p);
        if (Math.hypot(p.x - x, p.z - z) < CG4_B4.ring.radius) out.push(o);
        return;
      }
      for (const c of o.children) walk(c);
    };
    walk(root);
  }

  private setLit(hulls: Hull[]): void {
    for (const h of this.lit) brightHull(h, false);
    this.lit = hulls;
    for (const h of hulls) brightHull(h, true);
  }

  update(world: World, stage: SceneStage, _daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const tracker = this.tracker;
    tracker.tick(world, dt);
    const flags = stageFlags(world, stage);
    const home = world.location === 'grove';

    // K11, K38: what the look keys and the crowd's tale filter read.
    LOOK_STATE.tale = stage.tale === true && home;
    LOOK_STATE.campaign = flags.campaign;
    LOOK_STATE.chapter = flags.chapter;

    // K14: the ring and the outline step follow whoever speaks.
    const who = home ? tracker.speakerSpot(world) : null;
    const ring = this.ring;
    if (ring) {
      ring.visible = !!who;
      if (who) {
        ring.position.set(who.x, groveHeight(who.x, who.z) + CG4_B4.ring.lift, who.z);
        ring.scale.setScalar(who.kind === 'nubbin' ? 1 : Math.max(0.8, who.scale));
      }
    }
    this.scanIn -= dt;
    if (!who) {
      if (this.lit.length) this.setLit([]);
      this.litId = null;
    } else if (who.id !== this.litId || this.scanIn <= 0) {
      this.scanIn = CG4_B4.ring.scanS;
      this.litId = who.id;
      const rigs: THREE.Object3D[] = [];
      this.rigsAt(ctx.scene, who.x, who.z, rigs);
      const hulls: Hull[] = [];
      for (const r of rigs)
        r.traverse((o) => {
          if (o.userData.hull) hulls.push(o as Hull);
        });
      this.setLit(hulls);
    }

    // K38: Hazel's stick at her hand (from chapter 11; a tale shows her young).
    const stick = this.stick;
    const npc = world.npcs.find((n) => n.trainer === 'hazel');
    if (stick) {
      const on = home && !!npc && storyId('hazel') === 'hazel-old';
      stick.visible = on;
      if (on && npc) {
        const at = tracker.stager.holds.get(npc.id) ?? npc.pos;
        const yaw = tracker.stager.faces.get(npc.id) ?? npc.facing;
        const s = CG4_B4.hazel.oldScale;
        const lx = HAND_LANTERN.side * s;
        const lz = HAND_LANTERN.forward * s;
        const cs = Math.cos(yaw);
        const sn = Math.sin(yaw);
        const gx = at.x + lx * cs + lz * sn;
        const gz = at.z - lx * sn + lz * cs;
        stick.position.set(gx, groveHeight(gx, gz), gz);
        stick.rotation.set(0, yaw, -CG4_B4.hazel.stick.lean);
        stick.scale.setScalar(s);
      }
    }

    // K37: the departure's cocoon fades, then the flower grows on the last line.
    const D = CG4_B4.departure;
    const cocoon = this.cocoon;
    const dep = home && stage.props?.cocoon === 'show' && !!flags.storyline;
    if (cocoon && this.cocoonMat) {
      cocoon.visible = false;
      if (dep) {
        const spot = nextMemorial(world);
        const p = LOOK_STATE.lines > 1 ? LOOK_STATE.line / (LOOK_STATE.lines - 1) : 1;
        const fade = 1 - Math.min(1, p / D.fadeBy);
        cocoon.visible = fade > 0.01;
        this.cocoonMat.opacity = D.cocoonOpacity * fade;
        cocoon.position.set(spot.x, groveHeight(spot.x, spot.z), spot.z);
        const last = LOOK_STATE.lines > 0 && LOOK_STATE.line >= LOOK_STATE.lines - 1;
        this.flowerT = last ? this.flowerT + dt : 0;
        if (last) {
          if (!this.flower) {
            this.flower = memorialFlower();
            this.root.add(this.flower);
            void ctx.compile(this.flower);
          }
          const grow = reduce ? 1 : Math.min(1, this.flowerT / D.flowerGrowS);
          this.flower.visible = grow > 0.02;
          this.flower.scale.setScalar(Math.max(0.02, grow));
          this.flower.position.set(spot.x, groveHeight(spot.x, spot.z), spot.z);
        } else if (this.flower) this.flower.visible = false;
      } else {
        this.flowerT = 0;
        if (this.flower) this.flower.visible = false;
      }
    }
  }

  dispose(): void {
    this.setLit([]);
    LOOK_STATE.tale = false;
    LOOK_STATE.campaign = 'hazel';
    LOOK_STATE.chapter = 0;
    this.root.removeFromParent();
    // The flower's geometry and materials are shared (memorial.ts); nothing of it to free.
    for (const d of this.owned) d.dispose();
    this.owned = [];
    this.ring = this.stick = this.cocoon = this.flower = null;
    this.ctx = null;
  }
}

export const dress3dB4: Dressing3d = new Dress3dB4();
