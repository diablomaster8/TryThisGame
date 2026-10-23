import * as THREE from 'three';
import { lanternCarriers, nubbinSits, npcLookOf } from '../config/npc-looks';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import { LANTERN_POSTS } from '../config/tuning';
import { HAND_LANTERN, HUSH, LANTERN_E } from '../config/tuning-e';
import { CG4_A1 } from '../config/tuning-a1';
import { CG2_W } from '../config/tuning-w';
import type { Daylight } from '../render/daylight';
import { flickerAt, glowTexture, hushPresence, lanternLights, SceneClock } from '../render/dress-e';
import { LineClock } from '../render/line-clock';
import { npcHere, stageFlags } from '../render/scene-stage';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { stagedSeat } from './npc-accessories';
import { hushCardTexture } from './hush-card';
import { handPoint } from './stage-pose3d';
import { groveHeight } from './terrain';

/**
 * Campaign-graphics package e, Full 3D ("people and lanterns"): the same lamp states as the
 * pixel dressing (render/dress-e.ts `lanternLights`), shown as the glass's emissive plus one
 * additive halo card per post (no new lights; the lamp pool's own sources are the host's);
 * hand lanterns for the cast who carry one (an emissive box and one glow card, hung at the
 * hand's place on the mark); the Hush colossus as a soft grey card; and M6's seat, handed to
 * the Nubbin poser through `stagedSeat`. NPC silhouettes (H12) are Keeper-spec prims, built
 * by `specForKey` (render3d/npc-accessories.ts).
 */

const LANTERN_GLASS = '#ffb347';

class Dress3dE implements Dressing3d {
  readonly id = 'e';
  private ctx: Dress3dCtx | null = null;
  private root = new THREE.Group();
  private clock = new SceneClock();
  private line = new LineClock();
  private time = 0;
  private touched = new Set<string>();
  private glass = new Map<string, THREE.MeshStandardMaterial>();
  private halos = new Map<string, THREE.Sprite>();
  private hand: THREE.Group[] = [];
  private colossus: THREE.Sprite | null = null;
  private owned: Array<{ dispose(): void }> = [];
  private readonly handAt = new THREE.Vector3();

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.root = new THREE.Group();
    this.root.name = 'dress-e';
    this.clock = new SceneClock();
    this.line = new LineClock();
    this.time = 0;
    this.glass.clear();
    this.touched.clear();
    this.halos.clear();
    this.hand = [];
    this.owned = [];
    const glow = glowTexture();
    this.owned.push(glow);
    const card = (color: string): THREE.Sprite => {
      const m = new THREE.SpriteMaterial({
        map: glow,
        color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity: 0,
      });
      this.owned.push(m);
      const s = new THREE.Sprite(m);
      s.visible = false;
      return s;
    };
    for (const p of LANTERN_POSTS) {
      const s = card(LANTERN_GLASS);
      s.position.set(p.x, groveHeight(p.x, p.z) + 2.1, p.z);
      this.root.add(s);
      this.halos.set(p.id, s);
    }
    // Hand lanterns: a small pool (the vigil has four), one box, one cap, one glow card.
    const box = new THREE.BoxGeometry(HAND_LANTERN.box, HAND_LANTERN.box * 1.2, HAND_LANTERN.box);
    const capGeo = new THREE.BoxGeometry(HAND_LANTERN.box * 1.3, 0.025, HAND_LANTERN.box * 1.3);
    const cordGeo = new THREE.BoxGeometry(0.012, 0.22, 0.012);
    const glass = new THREE.MeshStandardMaterial({
      color: '#ffe9b0',
      emissive: LANTERN_GLASS,
      emissiveIntensity: HAND_LANTERN.emissive,
    });
    const wood = new THREE.MeshStandardMaterial({ color: '#4a3424', roughness: 0.9 });
    this.owned.push(box, capGeo, cordGeo, glass, wood);
    for (let i = 0; i < HAND_LANTERN.poolSize; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(box, glass);
      const cap = new THREE.Mesh(capGeo, wood);
      cap.position.y = HAND_LANTERN.box * 0.6 + 0.012;
      const cord = new THREE.Mesh(cordGeo, wood);
      cord.position.y = HAND_LANTERN.box * 0.6 + 0.12;
      const halo = card(LANTERN_GLASS);
      halo.scale.setScalar(HAND_LANTERN.glowSize);
      halo.material.opacity = HAND_LANTERN.glowOpacity;
      halo.visible = true;
      g.add(body, cap, cord, halo);
      g.visible = false;
      this.root.add(g);
      this.hand.push(g);
    }
    // The Hush: a soft grey mass at the edge of the fog.
    const tex = hushCardTexture();
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      fog: false,
      opacity: 0,
    });
    this.owned.push(tex, mat);
    const c = HUSH.colossus;
    this.colossus = new THREE.Sprite(mat);
    this.colossus.scale.set(c.width * CG2_W.hush.scale3d, c.height * CG2_W.hush.scale3d, 1);
    this.colossus.position.set(
      HUSH.origin.x,
      groveHeight(HUSH.origin.x, HUSH.origin.z) + CG2_W.hush.y3d,
      HUSH.origin.z + CG2_W.hush.z3d,
    );
    this.colossus.visible = false;
    this.root.add(this.colossus);
    ctx.world3d.add(this.root);
    void ctx.compile(this.root);
  }

  /** The four lantern glass materials, found through their pickable boxes the first time. */
  private findGlass(ctx: Dress3dCtx): void {
    if (this.glass.size >= LANTERN_POSTS.length) return;
    for (const o of ctx.pickables) {
      const pick = o.userData.pick as { kind: string; id: string } | undefined;
      if (pick?.kind !== 'lantern' || this.glass.has(pick.id)) continue;
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && m.isMeshStandardMaterial && m.transparent) this.glass.set(pick.id, m);
    }
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const flags = stageFlags(world, stage);
    this.time += dt;
    const sceneT = this.line.tick(flags.sceneId, this.clock.tick(flags.sceneId, dt), dt);
    const home = flags.location === 'grove';

    // M6: the Nubbin the scene seats.
    const moss = world.campaign?.mossId ?? null;
    stagedSeat.id = moss && nubbinSits(stage, moss, moss) ? moss : null;

    if (this.colossus) {
      const p = home ? hushPresence(flags.sceneId, sceneT, reduce) : 0;
      this.colossus.visible = p > 0.001;
      this.colossus.material.opacity = p * CG2_W.hush.opacity3d;
    }

    // H3: posts by name.
    this.findGlass(ctx);
    const states = home ? lanternLights(flags, stage, sceneT, reduce) : {};
    for (const p of LANTERN_POSTS) {
      const mat = this.glass.get(p.id);
      const halo = this.halos.get(p.id);
      const st = states[p.id];
      if (!st) {
        if (mat && this.touched.has(p.id)) {
          // Hand the glass back to the scene: lit with the lamps, until its next daylight.
          mat.emissive.set(LANTERN_GLASS);
          mat.emissiveIntensity = ctx.lampsOn() ? 2.2 : 0;
          this.touched.delete(p.id);
        }
        if (halo) halo.visible = false;
        continue;
      }
      let level = 0;
      if (st === 'lit') level = LANTERN_E.glassLit;
      else if (st === 'flicker') {
        const f = LANTERN_E.glassFlicker;
        level = reduce
          ? LANTERN_E.glassSteadyDim
          : f.min + (f.max - f.min) * flickerAt(this.time, f.hz);
      } else if (st === 'low') level = LANTERN_E.glassLow;
      if (mat) {
        mat.emissive.set(st === 'low' ? LANTERN_E.glassCold : LANTERN_E.glassWarm);
        mat.emissiveIntensity = level;
        this.touched.add(p.id);
      }
      if (halo) {
        const on = st !== 'out';
        halo.visible = on;
        if (on) {
          const k = level / LANTERN_E.glassLit;
          const night = 0.45 + 0.55 * daylight.darkness;
          halo.material.color.set(st === 'low' ? LANTERN_E.glassCold : LANTERN_E.glassWarm);
          halo.material.opacity = LANTERN_E.haloOpacity3d * Math.min(1, k) * night;
          halo.scale.setScalar(st === 'low' ? LANTERN_E.haloLowSize : LANTERN_E.haloSize);
        }
      }
    }

    // H4: hand lanterns on the cast's marks.
    const carriers = home ? lanternCarriers(stage) : [];
    this.hand.forEach((g, i) => {
      const c = carriers[i];
      const here =
        c && world.npcs.some((n) => n.trainer === c.who && npcHere(world.location, n.trainer));
      const m = c ? markAt(world.location, c.mark) : undefined;
      if (!c || !here || !m) {
        g.visible = false;
        return;
      }
      let yaw = m.yaw;
      if (c.face === 'you') yaw = Math.atan2(world.keeper.pos.x - m.x, world.keeper.pos.z - m.z);
      else if (c.face) {
        const other = (stage.cast ?? []).find((e) => e.who === c.face);
        const om = other ? markAt(world.location, other.mark) : undefined;
        if (om) yaw = Math.atan2(om.x - m.x, om.z - m.z);
      }
      const s = npcLookOf(c.who)?.scale ?? 1;
      // K13 (package a1): hung from the right hand when the Keeper's rig is up.
      const npc = world.npcs.find((n) => n.trainer === c.who);
      if (npc && handPoint(npc.id, this.handAt)) {
        g.position.set(this.handAt.x, this.handAt.y - CG4_A1.hand.lanternDrop * s, this.handAt.z);
        g.rotation.z = reduce ? 0 : Math.sin(this.time * 2 + i) * 0.07;
        g.visible = true;
        return;
      }
      const lx = HAND_LANTERN.side * s;
      const lz = HAND_LANTERN.forward * s;
      const cs = Math.cos(yaw);
      const sn = Math.sin(yaw);
      g.position.set(
        m.x + lx * cs + lz * sn,
        groveHeight(m.x, m.z) + HAND_LANTERN.height * s,
        m.z - lx * sn + lz * cs,
      );
      g.rotation.z = reduce ? 0 : Math.sin(this.time * 2 + i) * 0.07;
      g.visible = true;
    });
  }

  dispose(): void {
    stagedSeat.id = null;
    this.root.removeFromParent();
    for (const d of this.owned) d.dispose();
    this.owned = [];
    this.glass.clear();
    this.touched.clear();
    this.ctx = null;
  }
}

export const dress3dE: Dressing3d = new Dress3dE();
